const express = require('express');
const router = express.Router();


const homeController = require('../controllers/home_controller');

router.get('/',homeController.home);
router.use('/contact',homeController.contact);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments',require('./comments'));
router.use('/reset-password',require('./reset_pass'));
router.use('/likes',require('./likes'));
router.use('/friendships',require('./friendships'));




router.use('/api',require('./api'));



module.exports = router;