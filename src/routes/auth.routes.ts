import express from 'express'
const authController = require('../controllers/auth/auth.controller');
import Token from "../service/token";
import multer from 'multer';

const router = express.Router();

router.get('/', Token.verifyToken, authController.getAll);
router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/verify', authController.verifyOtp);
router.post('/resend', authController.resendOtp);

export default router;