const express = require('express');

const rapportsController = require('../controllers/rapports');

const { exigerAdmin } = require('../auth/roles');

const router = express.Router();


router.get('/list', exigerAdmin, rapportsController.getItems);


module.exports = router;