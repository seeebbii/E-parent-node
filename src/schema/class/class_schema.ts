import { timeStamp } from 'console'
import mongoose from 'mongoose'

// ! Importing teacher's Schema
import TeacherSchema from '../teacher/teacher_schema'

const ClassSchema = mongoose.Schema

const classSchema = new ClassSchema({

    grade: {
        type: String,
        required: true
    },

    section: {
        type: String,
        required: true,
    },

    classTeacher: TeacherSchema,

    studentsEnrolled : {
        type: Array,
        required: false
    }
    

}, {timestamps: true})

export default mongoose.model("ClassSchema", classSchema)