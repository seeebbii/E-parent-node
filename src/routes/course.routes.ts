import express from 'express'
const courseController = require('../controllers/class/course.controller')

const router = express.Router()


router.get('/', courseController.getAll);
router.get('/:id', courseController.getById);
router.get('/delete/:id', courseController.deleteById);
router.post('/insert', courseController.insert);


export default router