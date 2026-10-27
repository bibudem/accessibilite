const express = require('express');

const itemsController = require('../controllers/items');

const router = express.Router();

const { exigerConnexion, exigerAdmin } = require('../auth/roles');

const Items = require('../models/items');

const { DOSSIER_ITEMS, DOSSIER_SUPPRIMES, segmentValide } = require('../util/chemins');

let fs = require('fs');

const path = require('path');

const multer = require('multer');


let cors = require('cors')

// Gestion des notices : réservée aux gestionnaires
router.post('/add', exigerAdmin, itemsController.postItem);

router.put('/save', exigerAdmin, itemsController.putItem);

router.delete('/delete/:id', exigerAdmin, itemsController.deleteItem);

router.get('/fiche/:id', exigerAdmin, itemsController.consulterItem);

router.get('/all', exigerAdmin, itemsController.allItems);

router.get('/all/collections', exigerAdmin, itemsController.allListeCollections);

router.get('/updateUrl/:rep', exigerAdmin, itemsController.updateUrlItem);

let corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
}

router.use(cors(corsOptions))
router.use(express.urlencoded({ extended: true }));


// Dossier où multer écrit les fichiers pendant leur réception
const TEMP_DIR = '/apps/accessibilite/temp';
const TAILLE_MAX_GO = 9;
// Âge au-delà duquel un fichier temporaire est considéré comme abandonné
const AGE_MAX_TEMP_MS = 24 * 60 * 60 * 1000;
// Découpe le paramètre « fichier&dossier » ; null si l'un des deux est invalide
function lireParamFichier(param) {
  const [nameFile, folder] = String(param || '').split('&');
  if (!segmentValide(nameFile) || !segmentValide(folder)) {
    return null;
  }
  return { nameFile, folder };
}

// Configuration de `diskStorage` pour gérer le dossier temporaire
const storage = multer.diskStorage({
  destination: TEMP_DIR,
  filename: (req, file, cb) => {
    // Génère un nom de fichier unique pour éviter les conflits.
    // Le nom d'origine est assaini : il vient du client et pourrait contenir « ../ ».
    const nomSur = file.originalname.replace(/[^A-Za-z0-9_.-]/g, '_');
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${nomSur}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: TAILLE_MAX_GO * 1024 * 1024 * 1024 }, // Limite par fichier
});

// Traduit une erreur d'upload en code HTTP + message lisible pour l'interface
function erreurUpload(err) {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return { status: 413, message: `Le fichier dépasse la taille maximale autorisée (${TAILLE_MAX_GO} Go).` };
  }
  if (err.code === 'ENOSPC') {
    return { status: 507, message: 'Espace disque insuffisant sur le serveur. Contactez le soutien technique.' };
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return { status: 400, message: 'Un seul fichier peut être déposé à la fois.' };
  }
  return { status: 500, message: "Une erreur est survenue pendant l'enregistrement du fichier." };
}

// Supprime un fichier sans échouer s'il n'existe déjà plus
async function supprimerSiExiste(filePath) {
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`[upload] Impossible de supprimer ${filePath} — ${err.message}`);
    }
  }
}

// Les erreurs de multer (taille, disque plein) surviennent avant la route :
// on les intercepte ici pour répondre proprement au lieu de laisser Express renvoyer une page HTML.
function recevoirFichier(req, res, next) {
  upload.single('file')(req, res, async (err) => {
    if (!err) {
      return next();
    }
    if (req.file?.path) {
      await supprimerSiExiste(req.file.path);
    }
    const { status, message } = erreurUpload(err);
    console.error(`[upload] ERREUR réception: ${req.body?.nameFolder || '?'}/${req.file?.originalname || '?'} — ${err.code || ''} ${err.message}`);
    res.status(status).json({ message });
  });
}

// exigerAdmin passe avant multer : un non-gestionnaire ne peut même pas écrire dans le temporaire
router.put('/uploud', exigerAdmin, recevoirFichier, async (req, res) => {
  try {
    const { file } = req; // Récupère les informations du fichier
    if (!file) {
      return res.status(400).json({ message: 'Aucun fichier reçu.' });
    }

    const folderName = req.body.nameFolder;
    if (!segmentValide(folderName) || !segmentValide(file.originalname)) {
      await supprimerSiExiste(file.path);
      return res.status(400).json({ message: 'Nom de fichier ou dossier de destination invalide.' });
    }
    const folderItem = path.join(DOSSIER_ITEMS, folderName);
    const newPath = path.join(folderItem, file.originalname);

    // Créer le dossier de la notice
    await fs.promises.mkdir(folderItem, { recursive: true });

    // 🟢 Déplace le fichier temporaire vers son dossier final.
    // Pas de copie de sauvegarde : elle doublait l'espace disque, et le fichier temporaire
    // reste en place tant que le déplacement n'a pas réussi.
    await fs.promises.rename(file.path, newPath);

    console.log(`[upload] OK: ${folderName}/${file.originalname}`);

    res.status(200).json({ message: 'Fichier enregistré.' });
  } catch (err) {
    // Le fichier temporaire n'a pas été déplacé : on le retire pour ne pas remplir le disque
    if (req.file?.path) {
      await supprimerSiExiste(req.file.path);
    }
    const { status, message } = erreurUpload(err);
    console.error(`[upload] ERREUR: ${req.body?.nameFolder}/${req.file?.originalname || '?'} — ${err.code || ''} ${err.message}`);
    res.status(status).json({ message });
  }
});


// Supprime les fichiers temporaires abandonnés (uploads interrompus, erreurs passées).
// On ne touche qu'aux fichiers anciens pour ne pas effacer un upload encore en cours.
async function nettoyerDossierTemporaire() {
  try {
    const files = await fs.promises.readdir(TEMP_DIR);
    const limite = Date.now() - AGE_MAX_TEMP_MS;
    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      // Un fichier peut disparaître entre readdir et stat (upload terminé entre-temps)
      const stats = await fs.promises.stat(filePath).catch(() => null);
      if (stats && stats.isFile() && stats.mtimeMs < limite) {
        await supprimerSiExiste(filePath);
        console.log(`[upload] Fichier temporaire abandonné supprimé : ${file}`);
      }
    }
  } catch (err) {
    console.error(`[upload] Erreur lors du nettoyage de ${TEMP_DIR} — ${err.message}`);
  }
}

nettoyerDossierTemporaire();
setInterval(nettoyerDossierTemporaire, 60 * 60 * 1000).unref();

module.exports = router;



router.get('/deleteFile/:name', exigerAdmin, async function (req, res) {
  // Un nom ou dossier vide ferait viser DOSSIER_ITEMS lui-même (déplacement de tous les fichiers)
  const param = lireParamFichier(req.params.name);
  if (!param) {
    console.error(`[ERROR] Suppression refusée, paramètre invalide : ${req.params.name}`);
    return res.status(400).json({ status: 'error', moved: false, message: 'Nom de fichier ou dossier invalide.' });
  }
  const { nameFile, folder } = param;
  const sourceDir = path.join(DOSSIER_ITEMS, folder);
  const sourcePath = path.join(sourceDir, nameFile);
  const destDir = path.join(DOSSIER_SUPPRIMES, folder);
  const destPath = path.join(destDir, nameFile);

  let result = {
    status: 'error',
    message: '',
    moved: false,
    file: nameFile,
    from: sourcePath,
    to: destPath
  };

  try {
    await fs.promises.access(sourcePath, fs.constants.F_OK);
  } catch (err) {
    result.message = `Fichier introuvable : ${sourcePath}`;
    console.error(`[ERROR] ${result.message}`, err);
    return res.status(200).json(result); // Retourne quand même un 200
  }

  try {
    await fs.promises.mkdir(destDir, { recursive: true });
    await fs.promises.rename(sourcePath, destPath);
    // Le déplacement conserve la date du dépôt : on la remplace par la date de suppression,
    // pour pouvoir purger files-del manuellement selon l'âge (ex. find -mtime +30)
    const maintenant = new Date();
    await fs.promises.utimes(destPath, maintenant, maintenant).catch(() => {});
    result.status = 'success';
    result.moved = true;
    result.message = 'Fichier déplacé avec succès';
  } catch (err) {
    result.message = `Erreur lors du déplacement du fichier`;
    console.error(`[ERROR] ${result.message}`, err);
  }

  try {
    const remainingFiles = await fs.promises.readdir(sourceDir);
    if (remainingFiles.length === 0) {
      await fs.promises.rmdir(sourceDir);
      console.log(`[INFO] Dossier supprimé car vide : ${sourceDir}`);
    } else {
      console.log(`[INFO] Dossier non vide : ${sourceDir}`);
    }
  } catch (err) {
    console.warn(`[WARNING] Problème avec le dossier ${sourceDir}`, err.message);
  }

  return res.status(200).json(result);
});


router.get('/file/:name', exigerConnexion, async function (req, res) {
  const param = lireParamFichier(req.params.name);
  if (!param) {
    return res.status(400).json({ error: 'Invalid file name' });
  }
  const { nameFile, folder } = param;
  const folderPath = path.join(DOSSIER_ITEMS, folder);
  const filePath = path.join(folderPath, nameFile);

  // Gestionnaires : tous les fichiers. Autres : seulement ceux d'un de leurs paniers non expirés.
  if (req.utilisateur.groupe !== 'Admin') {
    try {
      if (!(await Items.fichierAccessible(req.utilisateur.courriel, nameFile, folder))) {
        console.error(`[file] Accès refusé : ${req.utilisateur.courriel} -> ${folder}/${nameFile}`);
        return res.status(403).json({ error: 'Access denied' });
      }
    } catch (err) {
      console.error(`[file] Erreur de vérification d'accès — ${err.message}`);
      return res.status(500).json({ error: 'Error checking access' });
    }
  }

  try {
    fs.readdir(folderPath, (err, files) => {
      let fileExist = 0;
      if (files) {
        files.forEach(file => {
          if (file === nameFile) {
            fileExist = 1;
          }
        });
      }

      if (fileExist) {
        // Vérification de l'existence du fichier
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (err) {
            return res.status(404).json({ error: 'File not found' });
          }

          // Déduire l'extension du fichier et définir le type MIME
          const extname = path.extname(filePath).toLowerCase();
          let mimeType = 'application/octet-stream'; // Valeur par défaut

          // Assigner un type MIME basé sur l'extension
          if (extname === '.pdf') {
            mimeType = 'application/pdf';
          } else if (extname === '.doc' || extname === '.docx') {
            mimeType = 'application/msword'; // Pour .doc et .docx
          } else if (extname === '.txt') {
            mimeType = 'text/plain';
          } else if (extname === '.jpg' || extname === '.jpeg') {
            mimeType = 'image/jpeg';
          } else if (extname === '.gif') {
            mimeType = 'image/gif';
          } else if (extname === '.png') {
            mimeType = 'image/png';
          } else if (extname === '.svg') {
            mimeType = 'image/svg+xml';
          } else if (extname === '.xls' || extname === '.xlsx') {
            mimeType = 'application/vnd.ms-excel'; // Pour .xls et .xlsx
          } else if (extname === '.csv') {
            mimeType = 'text/csv';
          } else if (extname === '.pptx' || extname === '.ppt') {
            mimeType = 'application/vnd.ms-powerpoint'; // Pour .pptx et .ppt
          } else if (extname === '.rtf') {
            mimeType = 'application/rtf';
          } else if (extname === '.mp3') {
            mimeType = 'audio/mpeg';
          } else if (extname === '.wav') {
            mimeType = 'audio/wav';
          } else if (extname === '.ogg') {
            mimeType = 'audio/ogg';
          } else if (extname === '.zip') {
            mimeType = 'application/zip';
          }

          // Le navigateur enregistre directement le fichier (en continu, sans le charger en mémoire)
          res.attachment(nameFile);

          // Définir l'en-tête de type MIME
          res.setHeader('Content-Type', mimeType);

          // Envoyer le fichier
          res.sendFile(filePath);
        });
      } else {
        res.status(404).json({ error: 'File not found in directory' });
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error reading directory' });
    console.error(err);
  }
});



module.exports = router;
