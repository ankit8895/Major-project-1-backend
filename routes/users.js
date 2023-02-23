const express = require('express');
const router = express.Router();

const userController = require('../controllers/users_controller');


router.get('/profile', userController.profile);
router.get('/edit',userController.edit);

module.exports = router;