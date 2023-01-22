import express from 'express'
import Token from '../service/token';
const parentController = require('../controllers/parent/parent.controller')

const router = express.Router()

router.post('/add_students', Token.verifyToken, parentController.addStudents)



export default router 