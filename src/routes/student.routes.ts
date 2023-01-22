import express from 'express'
import Token from '../service/token';
const studentController = require('../controllers/class/student.controller')

const router = express.Router()
router.get('/all', Token.verifyToken, studentController.getAll)
router.get('/:phone', Token.verifyToken, studentController.getMyStudents)
router.post('/add', Token.checkAdminRights, studentController.createStudent)



export default router