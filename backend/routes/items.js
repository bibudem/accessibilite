const express = require('express');

const itemsController = require('../controllers/items');

const router = express.Router();

let fs = require('fs');

const path = require('path');

const multer = require('multer');


let cors = require('cors')

router.post('/add', itemsController.postItem);

router.put('/save', itemsController.putItem);

router.delete('/delete/:id', itemsController.deleteItem);

router.get('/fiche/:id', itemsController.consulterItem);

router.get('/all', itemsController.allItems);

router.get('/all/collections', itemsController.allListeCollections);

router.get('/updateUrl/:rep', itemsController.updateUrlItem);

let corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
}

router.use(cors(corsOptions))
router.use(express.urlencoded({ extended: true }));


// Configuration de `diskStorage` pour gérer le dossier temporaire
const storage = multer.diskStorage({
  destination: '/apps/accessibilite/temp',
  filename: (req, file, cb) => {
    // Génère un nom de fichier unique pour éviter les conflits
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 1024 }, // Limite à 1 Go par fichier
});

router.put('/uploud', upload.single('file'), async (req, res) => {
  try {
    const { file } = req; // Récupère les informations du fichier
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const folderName = req.body.nameFolder;
    const folderItem = path.join('/apps/accessibilite/prod/backend/files/items/', folderName);
    const newPath = path.join(folderItem, file.originalname);
    const backupDir = '/apps/accessibilite/prod/backend/backup-temp';
    const backupPath = path.join(backupDir, file.filename);

    // Créer les dossiers nécessaires
    await fs.promises.mkdir(folderItem, { recursive: true });
    await fs.promises.mkdir(backupDir, { recursive: true });

    // 🔐 Crée une copie de sauvegarde du fichier temporaire avant de le déplacer
    await fs.promises.copyFile(file.path, backupPath);

    // 🟢 Déplace le fichier temporaire vers son dossier final
    await fs.promises.rename(file.path, newPath);

    console.log(`Fichier déplacé de ${file.path} à ${newPath}`);
    console.log(`Copie de sauvegarde conservée à : ${backupPath}`);

    // Nettoyage optionnel du dossier temporaire
    await cleanTemporaryDirectory();

    res.status(200).send('File successfully uploaded and moved.');
  } catch (err) {
    console.error('Error during file upload:', err);
    res.status(500).send('An error occurred during file upload.');
  }
});


// Fonction optionnelle pour nettoyer le dossier temporaire (si nécessaire)
async function cleanTemporaryDirectory() {
  const tempDir = '/apps/accessibilite/prod/backend/temp';

  try {
    const files = await fs.promises.readdir(tempDir);
    // Supprimez tous les fichiers temporaires
    await Promise.all(files.map(file => fs.promises.unlink(path.join(tempDir, file))));
    //console.log('Temporary directory cleaned.');
  } catch (err) {
    console.error('Error cleaning temporary directory:', err);
  }
}

module.exports = router;



router.get('/deleteFile/:name', async function (req, res) {
  const name = req.params.name;
  const [nameFile, folder] = name.split('&');
  const sourceDir = path.join('/apps/accessibilite/prod/backend/files/items/', folder);
  const sourcePath = path.join(sourceDir, nameFile);
  const destDir = path.join('/apps/accessibilite/prod/backend/files-del', folder);
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


router.get('/file/:name', function (req, res) {
  const name = req.params.name;
  const nameFile = name.split('&')[0];
  const folder = name.split('&')[1];
  const folderPath = '/apps/accessibilite/prod/backend/files/items/' + folder;
  const filePath = path.join(folderPath, nameFile);

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
