import { timeStamp } from 'console'
import mongoose from 'mongoose'

const AttendanceSchema = mongoose.Schema

const attendanceSchema = new AttendanceSchema({

    // teacher_id: {
    //     type: Object,
    //     required: true
    // },

    class_id: {
        type: Object,
        required: true
    },

    student_id:{
        type: Object,
        required: true
    },
    
    attendance_date: {
        type: Date,
        default: Date.now(),
        required: true
    },

    // L -> leave
    // P -> present
    // A -> absent

    attendance_status: {
        type: String,
        required: true,
    }

}, {timestamps: true})

export default mongoose.model("AttendanceSchema", attendanceSchema)