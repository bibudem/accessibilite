const express = require('express');

const linkController = require('../controllers/link');

const { exigerConnexion } = require('../auth/roles');

const router = express.Router();



// Les étudiants y accèdent : le contrôleur limite le résultat à leurs propres paniers
router.get('/:key', exigerConnexion, linkController.getLink);

router.get('/update-state/:id', exigerConnexion, linkController.updateStateLink);


module.exports = router;
