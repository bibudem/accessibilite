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
  let name=req.params.name;
  let nameFile=name.split('&')[0];
  let folder=name.split('&')[1];
  //const path = './../src/assets/files/items/'+folder;
  const path = '/apps/accessibilite/prod/backend/files/items/'+folder;
  try {
    fs.readdir(path, (err, files) => {
      let deleteFile=0;
      files.forEach(file => {
        if(file==nameFile){
          fs.unlink(path +'/'+ nameFile, (err) => {
            if (err) {
              console.log(err);
              deleteFile=0;
            }
            deleteFile=1;
          });
        }
      });
      //delete folder
      fs.rmSync(path, { recursive: true, force: true });
      res.status(200).json([deleteFile]);
    });

  } catch(err) {
    res.status(200).json([0]);
    console.error(err)
  }
});

router.get('/file/:name', function (req, res) {
  let name=req.params.name;
  let nameFile=name.split('&')[0];
  let folder=name.split('&')[1];
  const path = '/apps/accessibilite/prod/backend/files/items/'+folder;

  try {
    fs.readdir(path, (err, files) => {
      let fileExist=0;
      if(files){
        files.forEach(file => {
          //console.log(file);
          if(file==nameFile){
            fileExist=1;
          }
        });
      }
      res.status(200).json([fileExist]);
    });
  } catch(err) {
    res.status(200).json([0]);
    console.error(err)
  }
});



module.exports = router;
