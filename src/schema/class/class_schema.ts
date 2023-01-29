import { timeStamp } from 'console'
import mongoose from 'mongoose'

const ClassSchema = mongoose.Schema

const classSchema = new ClassSchema({

    grade: {
        type: Number,
        required: true
    },

    section: {
        type: String,
        required: true,
    },

    classTeacher: {
        type: Object,
        required: true
    },

    studentsEnrolled : {
        type: [Object],
        required: false
    }
    

}, {timestamps: true})

export default mongoose.model("ClassSchema", classSchema)