import mongoose, { Mongoose } from "mongoose";
const ParentSchema = mongoose.Schema

const parentSchema = new ParentSchema({

    role_id : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    students: {
        type: Array,
        default: []
    }

    


}, {timestamps: true})



export default mongoose.model('ParentSchema', parentSchema)