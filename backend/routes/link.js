const express = require('express');

const linkController = require('../controllers/link');

const authMiddleware = require('../auth/authMiddleware');

const router = express.Router();



router.get('/:key',authMiddleware, linkController.getLink);

router.get('/update-state/:id', linkController.updateStateLink);


module.exports = router;
