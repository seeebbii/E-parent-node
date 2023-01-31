import { timeStamp } from 'console'
import mongoose from 'mongoose'

const AcademicReportSchema = mongoose.Schema

const academicReportSchema = new AcademicReportSchema({

    student_id:{
        type: Object,
        required: true
    },

    class_id: {
        type: Object,
        required: true
    },

    teacher_id: {
        type: Object,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    total_marks: {
        type: Number,
        required: true
    },

    obtained_marks: {
        type: Number,
        required: true
    }




}, {timestamps: true})

export default mongoose.model("AcademicReportSchema", academicReportSchema)