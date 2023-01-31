import express from 'express'
const authController = require('../controllers/auth/auth.controller');
import Token from "../service/token";
import multer from 'multer';

const router = express.Router();

router.get('/', Token.verifyToken, authController.getAll);
router.get('/profile', Token.fetchProfile, authController.getAll);

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/change_password', authController.changePassword);

router.post('/verify', authController.verifyOtp);
router.post('/resend', authController.resendOtp);

router.post('/notifications/', authController.getAllNotifications);
router.post('/update_notification_status/', authController.updateNotificationStatus);

export default router;