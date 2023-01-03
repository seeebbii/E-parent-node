import express from 'express'
import Token from '../service/token';
const classController = require('../controllers/class/class.controller')

const router = express.Router()

router.get('/', Token.verifyToken, classController.getAll);
router.post('/insert', Token.checkAdminRights, classController.insert);


export default router