const express = require('express');

const rapportsController = require('../controllers/rapports');

const router = express.Router();


router.get('/list', rapportsController.getItems);


module.exports = router;