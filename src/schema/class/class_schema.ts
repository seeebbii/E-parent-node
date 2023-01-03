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
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    studentsEnrolled : {
        type: [mongoose.Schema.Types.ObjectId],
        required: false
    }
    

}, {timestamps: true})

export default mongoose.model("ClassSchema", classSchema)