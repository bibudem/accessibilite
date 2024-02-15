const express = require('express');

const panierController = require('../controllers/panier');

const router = express.Router();


router.post('/add', panierController.post);

router.put('/save-panier', panierController.update);

router.delete('/delete/:id', panierController.delete);

router.get('/fiche/:id', panierController.consulter);

router.get('/all', panierController.getAll);

router.post('/add-details', panierController.addDetails);

router.get('/historique/:idItem', panierController.listeHistorique);

module.exports = router;
