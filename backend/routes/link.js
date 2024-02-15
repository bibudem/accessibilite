const express = require('express');

const linkController = require('../controllers/link');

const router = express.Router();



router.get('/:key', linkController.getLink);

router.get('/update-state/:id', linkController.updateStateLink);


module.exports = router;
