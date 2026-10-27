const express = require('express');

const panierController = require('../controllers/panier');

const { exigerAdmin, exigerRoles } = require('../auth/roles');

const router = express.Router();


// Gestion des paniers : réservée aux gestionnaires
router.post('/add', exigerAdmin, panierController.post);

router.put('/save-panier', exigerAdmin, panierController.update);

router.delete('/delete/:id', exigerAdmin, panierController.delete);

router.get('/fiche/:id', exigerAdmin, panierController.consulter);

// Liste de l'historique : aussi consultée par les bibliothécaires
router.get('/all', exigerRoles('Admin', 'Viewer'), panierController.getAll);

router.post('/add-details', exigerAdmin, panierController.addDetails);

router.get('/historique/:idItem', exigerAdmin, panierController.listeHistorique);

module.exports = router;
