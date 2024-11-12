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
    //console.log(file);
    const folderName = req.body.nameFolder;
    const folderItem = path.join('/apps/accessibilite/prod/backend/files/items/', folderName);
    const newPath = path.join(folderItem, file.originalname);

    // Créer le répertoire cible s'il n'existe pas déjà
    await fs.promises.mkdir(folderItem, { recursive: true });

    // Copier le fichier temporaire vers le chemin cible
    await fs.promises.rename(file.path, newPath);

    //console.log(`Fichier déplacé de ${file.path} à ${newPath}`);

    // Optionnel : nettoyer le dossier temporaire si vous le souhaitez
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



router.get('/deleteFile/:name', function (req, res) {
  let name = req.params.name;
  let nameFile = name.split('&')[0];
  let folder = name.split('&')[1];
  const path = '/apps/accessibilite/prod/backend/files/items/' + folder;

  try {
    fs.readdir(path, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return res.status(500).json([0]); // Retourne une réponse avec le statut d'erreur
      }

      let deleteFile = 0;

      files.forEach(file => {
        if (file === nameFile) {
          fs.unlink(path + '/' + nameFile, (err) => {
            if (err) {
              console.error('Error deleting file:', err);
              deleteFile = 0;
            } else {
              deleteFile = 1;
            }
          });
        }
      });

      // Supprimer le dossier
      fs.rmSync(path, { recursive: true, force: true });

      // Envoyer la réponse après la boucle
      res.status(200).json([deleteFile]);
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json([0]);
  }
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
