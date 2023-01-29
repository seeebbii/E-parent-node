import express from 'express'
import Token from '../service/token';
const classController = require('../controllers/class/class.controller')

const router = express.Router()

router.get('/', Token.verifyToken, classController.getAll);
router.get('/:teacher_id', Token.verifyToken, classController.getAllById);
router.post('/insert', Token.checkAdminRights, classController.insert);


router.get('/students_in_class/:class_id', Token.verifyToken, classController.studentsInClass);

router.post('/create_diary', Token.verifyToken, classController.createDiary)
router.get('/view_class_diaries/:class_id', Token.verifyToken, classController.viewClassDiaries)

router.post('/view_teacher_class_diaries', Token.verifyToken, classController.viewTeacherClassDiaries)

router.post('/assign_students', Token.verifyToken, classController.assignStudents)

router.post('/update_class_teacher', Token.verifyToken, classController.updateClassTeacher)

export default router