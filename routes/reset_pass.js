const express = require('express');
const router = express.Router();


const resetPasswordController = require('../controllers/reset_pass');


router.get('/',resetPasswordController.home);
router.post('/verify-email',resetPasswordController.verifyEmail);
router.post('/reset',resetPasswordController.reset);
router.get('/authorization/:accessToken', resetPasswordController.resetPassword);







module.exports = router;