import mongoose from 'mongoose'

const NotificationSchema = mongoose.Schema

const notificationSchema = new NotificationSchema({
    sent_by: Object,
    sent_to: Object, 
    title: String,
    description: String,
    notification_type: {
        type: String,
        default: "",
    },
    sent_at: {
        type: Date, default: Date.now()
    },
    read: {
        type: Boolean, 
        default: false
    }
   
}, {timestamps: true})

export default mongoose.model("NotificationSchema", notificationSchema)