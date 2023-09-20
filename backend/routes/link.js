const express = require('express');

const linkController = require('../controllers/link');

const router = express.Router();



router.get('/:key', linkController.getLink);

router.put('state/:key', linkController.updateStateLink);


module.exports = router;
