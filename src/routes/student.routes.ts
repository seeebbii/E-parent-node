import express from 'express'
import Token from '../service/token';
const studentController = require('../controllers/class/student.controller')

const router = express.Router()

router.get('/manage_enrollment/search', Token.checkAdminRights, studentController.manageEnrollment)
router.get('/manage_enrollment/search/:query', Token.checkAdminRights, studentController.manageEnrollment)

router.get('/all', Token.verifyToken, studentController.getAll)

router.get('/:phone', Token.verifyToken, studentController.getMyStudents)

router.post('/add', Token.checkAdminRights, studentController.createStudent)

router.post('/insert_courses', Token.checkAdminRights, studentController.insertCourses)




export default router