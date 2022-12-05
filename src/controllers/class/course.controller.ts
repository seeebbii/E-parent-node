import CourseSchema from '../../schema/class/course_schema'
import express from 'express'

exports.getAll = (req: express.Request, res: express.Response, next : any) => {

    CourseSchema.find().then((result) => {
        res.status(200).json({status:200, success: true, data: result})
    }).catch((err) => {
        res.status(400).json({status:400, messgae: err, success: false });
    })
}

exports.getById = (req: express.Request, res: express.Response, next : any) => {

    CourseSchema.findById(req.params.id.toString()).then((result) => {
        res.status(200).json({status:200, success: true, data: result})
    }).catch((err) => {
        res.status(400).json({status:400, messgae: err, success: false });
    })
}

exports.deleteById = (req: express.Request, res: express.Response, next : any) => {

    CourseSchema.findOneAndDelete({_id: req.params.id.toString()}).then((result) => {
        res.status(200).json({status:200, success: true, message: "Course Deleted successfully"})
    }).catch((err) => {
        res.status(400).json({status:400, messgae: err, success: false });
    })
}


exports.insert = async (req: express.Request, res: express.Response, next : any) => {

    const {course_name, course_code} = req.body;
    const foundCourse = await CourseSchema.findOne({$and: [{course_name: course_name}, {phone: course_code}]});
    if(foundCourse != null){
        return res.status(400).json({ status:400, messgae: "Course already exists", success: false });
    }

    new CourseSchema(req.body).save().then((result) => {
        return res.status(200).json({status:200, success: true, message: "New course added"})
    }).catch((err) => {
        if(err.name === "ValidationError"){
            return res.status(400).json({ status:400, messgae: "Validation Error", err: err, success: false });
        }

        res.status(400).json({ status:400, messgae: "Course already exists", success: false });
    })
}