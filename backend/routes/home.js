const express = require('express');

const homeController = require('../controllers/home');

const { exigerAdmin } = require('../auth/roles');

const router = express.Router();



// Statistiques du tableau de bord : réservées aux gestionnaires
router.get('/count', exigerAdmin, homeController.getCount);

router.get('/graphique', exigerAdmin, homeController.getGraphiqueDonnees);


module.exports = router;
