import mongoose from 'mongoose'
const CourseSchema = mongoose.Schema

const courseSchema = new CourseSchema({

    course_name: {
        type: String, required: true,
        unique: true,
        dropDups: true,
    },

    course_code: {
        type: String, required: true,
        unique: true, 
        dropDups: true,
    },

    

}, {timestamps: true,})


export default mongoose.model("CourseSchema", courseSchema)