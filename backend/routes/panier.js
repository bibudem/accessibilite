const express = require('express');

const panierController = require('../controllers/panier');

const authMiddleware = require('../auth/authMiddleware');

const router = express.Router();


router.post('/add',authMiddleware, panierController.post);

router.put('/save-panier',authMiddleware, panierController.update);

router.delete('/delete/:id',authMiddleware, panierController.delete);

router.get('/fiche/:id',authMiddleware, panierController.consulter);

router.get('/all',authMiddleware, panierController.getAll);

router.post('/add-details',authMiddleware, panierController.addDetails);

router.get('/historique/:idItem',authMiddleware, panierController.listeHistorique);

module.exports = router;
