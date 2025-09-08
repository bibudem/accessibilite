const express = require('express');

const rapportsController = require('../controllers/rapports');

const authMiddleware = require('../auth/authMiddleware');

const router = express.Router();


router.get('/list',authMiddleware, rapportsController.getItems);


module.exports = router;