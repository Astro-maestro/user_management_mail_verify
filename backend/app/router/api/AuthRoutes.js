// routes/authRoutes.js
const express = require('express');
const AuthController = require('../../modules/user/controller/api/AuthController');
const authenticateToken = require('../../middleware/authenticate'); // Middleware to authenticate JWT
const router = express.Router();
const uploadUserImage = require('../../helper/UserImageUpload');




router.post('/admin/register',uploadUserImage.single('image'), AuthController.adminRegister);
router.post('/register',authenticateToken, uploadUserImage.single('image'), AuthController.registerCreate);
router.post('/login', AuthController.login);
router.put('/updatePassword', authenticateToken, AuthController.updatePassword);
router.get('/dashboard', authenticateToken, AuthController.dashboard);
router.post('/logout', authenticateToken, AuthController.logout);
router.get("/confirmation/:email/:token", AuthController.confirmation);
router.post("/forgotPassword", AuthController.forgotPassword);
router.put("/resetPassword/:token", AuthController.resetPassword);

module.exports = router;
