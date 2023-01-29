import { timeStamp } from 'console'
import mongoose from 'mongoose'

const DiarySchema = mongoose.Schema

const diarySchema = new DiarySchema({

    class_id: {
        type: Object,
        required: true
    },

    diary: {
        type: String,
        required: true
    },

    current_date:{
        type: Date,
        required: true,
        default: Date.now()
    }


}, {timestamps: true})

export default mongoose.model("DiarySchema", diarySchema)