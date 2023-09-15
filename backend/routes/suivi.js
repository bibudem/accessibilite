const express = require('express');

const suiviController = require('../controllers/suivi');

const router = express.Router();

router.get('/all/:id', suiviController.allSuivi);

router.post('/add', suiviController.addSuivi);

router.put('/save', suiviController.saveSuivi);

router.delete('/delete/:id', suiviController.deleteSuivi);


module.exports = router;
