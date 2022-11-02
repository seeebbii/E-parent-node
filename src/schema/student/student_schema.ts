import mongoose, { Mongoose } from "mongoose";
const StudentSchema = mongoose.Schema

const studentSchema = new StudentSchema({
    
    full_name: {
        type: String, 
        required: true
    },

    parent_id: {
        type: mongoose.Schema.Types.ObjectId
    }

}, {timestamps: true})



export default mongoose.model('StudentSchema', studentSchema)