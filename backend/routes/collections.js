const express = require('express');

const collectionsController = require('../controllers/collections');

const { exigerAdmin } = require('../auth/roles');

const router = express.Router();

// Gestion des collections : réservée aux gestionnaires
router.post('/add', exigerAdmin, collectionsController.post);

router.put('/save', exigerAdmin, collectionsController.put);

router.delete('/delete/:id', exigerAdmin, collectionsController.delete);

router.get('/fiche/:id', exigerAdmin, collectionsController.consulter);

router.get('/all', exigerAdmin, collectionsController.getAll);

module.exports = router;
