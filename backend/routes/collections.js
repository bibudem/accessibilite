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

module.exports = router;
