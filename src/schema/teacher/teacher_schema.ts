import mongoose, { Mongoose } from "mongoose";
const TeacherSchema = mongoose.Schema


const teacherSchema = new TeacherSchema({

    name: {
        type: String, required: true
    },

    email: {type: String, required: true},

    



}, {timestamps: true})



export default mongoose.model('TeacherSchema', teacherSchema)