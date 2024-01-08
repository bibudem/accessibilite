const express = require('express');

const suiviController = require('../controllers/suivi');

const router = express.Router();

router.get('/all/:id', suiviController.allSuivi);


module.exports = router;
