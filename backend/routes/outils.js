const express = require('express');

const outilsController = require('../controllers/outils');

const router = express.Router();

router.get('/all-fonds', outilsController.allFonds);

router.get('/fiche-fond/:id', outilsController.ficheFond);

router.delete('/delete-fond/:id', outilsController.deleteFond);

router.put('/save-fond', outilsController.putFond);

router.post('/add-fond', outilsController.addFond);

router.get('/all-fournisseurs', outilsController.allFournisseurs);

router.get('/fiche-fournisseur/:id', outilsController.ficheFournisseur);

router.delete('/delete-fournisseur/:id', outilsController.deleteFournisseur);

router.put('/save-fournisseur', outilsController.putFournisseur);

router.post('/add-fournisseur', outilsController.addFournisseur);


module.exports = router;
