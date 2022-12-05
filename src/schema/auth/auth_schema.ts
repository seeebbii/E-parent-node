import mongoose, { Mongoose } from "mongoose"
const AuthSchema = mongoose.Schema

const authSchema = new AuthSchema({

    // ! Schema's Object id will be used as a Foreign key also known as "role_id" in "TeacherSchema" and "ParentSchema" 

    admin: {
        type: Boolean,
        default: false
    },

    // ! Types of Roles:
    // ! 1. Teacher (can be admin or just teacher)
    // ! 2. Parent (can never be admin)
    
    role: {
        type: Number,
        required: true,
    },

    full_name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    country_code: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    complete_phone: String,

    verified: {
        type: Boolean, 
        default: false
    },

    verified_at: {
        type: Date,
        default: null
    },

    fcm_token: {
        type: String,
        default: null,
    }


}, {timestamps: true})



export default mongoose.model('AuthSchema', authSchema)