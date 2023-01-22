import mongoose from 'mongoose'

const MessageSchema = mongoose.Schema

const messageSchema = new MessageSchema({

    room_id: String,

    messages: [
        {
            sent_by: Object,
            message: String,
            sent_at: {
                type: Date,
                default: Date.now()
            }
        }
    ]

   
}, {timestamps: true})

export default mongoose.model("MessageSchema", messageSchema)