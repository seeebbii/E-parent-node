import mongoose from 'mongoose'
const LeaveSchema = mongoose.Schema

const leaveSchema = new LeaveSchema({

    class_id: {
        type: Object,
        required: true
    },

    student_id:{
        type: Object,
        required: true
    },

    parent_id: {
        type: Object,
        required: true
    },
    
    teacher_id: {
        type: Object,
        required: true
    },

    date_for_leave: {
        type: Date, 
        default: Date.now(),
        required: true
    },

    reason_for_leave: {
        type: String,
        required: true
    },

    leave_status: {
        type: Boolean,
        default: null
    }

    

}, {timestamps: true,})


export default mongoose.model("LeaveSchema", leaveSchema)