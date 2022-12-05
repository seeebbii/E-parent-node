import express from 'express'
import Token from '../service/token';
const courseController = require('../controllers/class/course.controller')

const router = express.Router()


router.get('/', Token.verifyToken, courseController.getAll);
router.get('/:id', Token.verifyToken, courseController.getById);
router.get('/delete/:id', Token.checkAdminRights, courseController.deleteById);
router.post('/insert', Token.checkAdminRights, courseController.insert);


export default router