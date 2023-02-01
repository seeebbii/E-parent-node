import { timeStamp } from 'console'
import mongoose from 'mongoose'

const AssignmentSchema = mongoose.Schema

const assignmentSchema = new AssignmentSchema({

    class_id: {
        type: Object,
        required: true
    },


    title: {
        type: String,
        required: true
    },

    file: {
        type: String,
        required: true
    }




}, {timestamps: true})

export default mongoose.model("AssignmentSchema", assignmentSchema)