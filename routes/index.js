const express = require('express');
const router = express.Router();


const homeController = require('../controllers/home_controller');

router.get('/',homeController.home);
router.use('/contact',homeController.contact);
router.use('/users', require('./users'));
router.use('/post', require('./posts'));



module.exports = router;