import mongoose, { Mongoose } from "mongoose";
const StudentSchema = mongoose.Schema

const studentSchema = new StudentSchema({
    
    full_name: {
        type: String, 
        required: true
    },


    parent_id: {
        type: mongoose.Schema.Types.ObjectId
    },

    dob: {
        type: Date,
        required: true
    },

    age: {
        type: Number,
        default: null
    },

    parent_phone: {
        type: String,
        required : true
    },

    class_id: mongoose.Schema.Types.ObjectId,

    courses_enrolled: {
        type: Array,
        default: []
    },


    // Attendance Model here
    


}, {timestamps: true})



export default mongoose.model('StudentSchema', studentSchema)