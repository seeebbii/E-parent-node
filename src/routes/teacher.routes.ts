import express from 'express'
import Token from '../service/token';
const teacherController = require('../controllers/teacher/teacherController')

const router = express.Router()

router.get('/', Token.verifyToken, teacherController.getAllTeachers)



export default router