import mongoose from 'mongoose'

const ChatSchema = mongoose.Schema

const chatSchema = new ChatSchema({

    first_user: Object,
    second_user: Object,

    // ! Room id will be combination of parent_id and teacher_id
    // ! parent_id_teacher_id
    room_id: String,

    last_message: {type: String, default: ""},
    last_message_sent_at: {type: Date, default: Date.now()},

   
}, {timestamps: true})

export default mongoose.model("ChatSchema", chatSchema)