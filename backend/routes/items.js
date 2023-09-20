const express = require('express');

const itemsController = require('../controllers/items');

const router = express.Router();

let formidable = require('formidable');

let fs = require('fs');

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

router.put('/uploud', function (req, res) {
  //console.log(req);
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    let folderName=fields.nameFolder;
    //console.log(files);
    var oldpath = files.file.filepath;
    //var newpath = './../src/assets/files/items/' + files.file.originalFilename;
    var folderItem = './../src/assets/files/items/'+folderName;

    if (!fs.existsSync(folderItem)){
      fs.mkdirSync(folderItem);
    }
    var newpath = folderItem + '/' + files.file.originalFilename;
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      res.write('File uploaded and moved!');
      console.log('File uploaded +++');
      res.end();
    });
  });
});

router.get('/deleteFile/:name', function (req, res) {
  let name=req.params.name;
  let nameFile=name.split('&')[0];
  let folder=name.split('&')[1];
  const path = './../src/assets/files/items/'+folder;
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
  const path = './../src/assets/files/items/'+folder;
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
