const express = require('express');

const collectionsController = require('../controllers/collections');

const router = express.Router();

let formidable = require('formidable');

let fs = require('fs');

let cors = require('cors')

router.post('/add', collectionsController.post);

router.put('/save', collectionsController.put);

router.delete('/delete/:id', collectionsController.delete);

router.get('/fiche/:id', collectionsController.consulter);

router.get('/all', collectionsController.getAll);

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
      console.log(files.thumbnail.filepath);
      var oldpath = files.thumbnail.filepath;
      var newpath = './../src/assets/files/collections/' + files.thumbnail.originalFilename;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        console.log('File uploaded +++');
        res.end();
      });
    });
});

router.get('/deleteFile/:name', function (req, res) {
  let nameFile=req.params.name;
  const path = './../src/assets/files/collections';
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
      res.status(200).json([deleteFile]);
    });
  } catch(err) {
    res.status(200).json([0]);
    console.error(err)
  }
});
router.get('/file/:name', function (req, res) {
  let nameFile=req.params.name;
  const path = './../src/assets/files/collections';
  try {
    fs.readdir(path, (err, files) => {
      let fileExist=0;
      files.forEach(file => {
        if(file==nameFile){
          fileExist=1;
        }
      });
      res.status(200).json([fileExist]);
    });
  } catch(err) {
    res.status(200).json([0]);
    console.error(err)
  }
});


module.exports = router;
