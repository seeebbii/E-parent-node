import express from 'express'
import Token from '../service/token';
const classController = require('../controllers/class/class.controller')
import multer from 'multer';
const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    
    filename: function (req: any, file: any, cb: any) {
        cb(null, file.originalname)
    }
});

const upload = multer({storage: storage,});


router.get('/', Token.verifyToken, classController.getAll);
router.get('/:teacher_id', Token.verifyToken, classController.getAllById);
router.post('/insert', Token.checkAdminRights, classController.insert);


router.get('/students_in_class/:class_id', Token.verifyToken, classController.studentsInClass);

router.post('/create_diary', Token.verifyToken, classController.createDiary)
router.get('/view_class_diaries/:class_id', Token.verifyToken, classController.viewClassDiaries)

router.post('/view_diary_date', Token.verifyToken, classController.viewDiaryByDate)

router.post('/view_teacher_class_diaries', Token.verifyToken, classController.viewTeacherClassDiaries)

router.post('/assign_students', Token.verifyToken, classController.assignStudents)

router.post('/update_class_teacher', Token.verifyToken, classController.updateClassTeacher)

router.post('/upload_class_attendance', Token.verifyToken, classController.uploadClassAttendance)

router.post('/view_class_attendance', Token.verifyToken, classController.viewClassAttendance)

router.post('/view_student_attendance', Token.verifyToken, classController.viewStudentAttendance)


router.post('/view_request_leave', Token.verifyToken, classController.viewAllRequests)
router.post('/view_parent_request_leave', Token.verifyToken, classController.viewParentRequestLeaves)

router.post('/request_leave', Token.verifyToken, classController.requestLeave)

router.post('/accept_request_leave', Token.verifyToken, classController.acceptRequestLeave)
router.post('/reject_request_leave', Token.verifyToken, classController.rejecttRequestLeave)

router.post('/fetch_parent', Token.verifyToken, classController.fetchParent)

// ! Academic Report Routes
router.post('/upload_academics', Token.verifyToken, classController.uploadAcademics)
router.post('/upload_class_assignment', [Token.verifyToken, upload.single('file')], classController.uploadClassAssignment)

export default router