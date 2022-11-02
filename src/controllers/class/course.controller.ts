import CourseSchema from '../../schema/class/course_schema'
import express from 'express'

exports.getAll = (req: express.Request, res: express.Response, next : any) => {

    CourseSchema.find().then((result) => {
        res.status(200).json({status:200, success: false, data: result})
    }).catch((err) => {
        res.status(500).json({status:500, messgae: err, success: false });
    })
}

exports.getById = (req: express.Request, res: express.Response, next : any) => {

    CourseSchema.findById(req.params.id.toString()).then((result) => {
        res.status(200).json({status:200, success: true, data: result})
    }).catch((err) => {
        res.status(500).json({status:500, messgae: err, success: false });
    })
}

exports.deleteById = (req: express.Request, res: express.Response, next : any) => {

    CourseSchema.findOneAndDelete({_id: req.params.id.toString()}).then((result) => {
        res.status(200).json({status:200, success: true, message: "Course Deleted successfully"})
    }).catch((err) => {
        res.status(500).json({status:500, messgae: err, success: false });
    })
}


exports.insert = (req: express.Request, res: express.Response, next : any) => {

    new CourseSchema(req.body).save().then((result) => {
        res.status(200).json({status:200, success: true, message: "New course added"})
    }).catch((err) => {
        if(err.name === "ValidationError"){
            return res.status(500).json({ status:500, messgae: "Validation Error", err: err, success: false });
        }

        res.status(500).json({ status:500, messgae: err, success: false });
    })
}