import mongoose, { Mongoose } from "mongoose";
const TeacherSchema = mongoose.Schema

// ! Importing Course Schema
import CourseSchema from '../class/course_schema'


const teacherSchema = new TeacherSchema({

    role_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    course_teaches: {
        type: Array,
        default: []
    },


}, {timestamps: true})



export default mongoose.model('TeacherSchema', teacherSchema)