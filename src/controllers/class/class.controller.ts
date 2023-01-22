import express from 'express' 
import ClassSchema from '../../schema/class/class_schema'
import TeacherSchema from '../../schema/teacher/teacher_schema'

exports.getAll = async (req: express.Request, res: express.Response, next : any) => {

    ClassSchema.find().then((result : any) => {
        res.status(200).json({status:200, success: true, data: result})
    }).catch((err) => {
        res.status(400).json({status:400, message: err, success: false });
    })
    
}


exports.insert = async (req: express.Request, res: express.Response, next : any) => {

    const {grade, section, teacherId} = req.body;

    // Checking Duplicate Entries
    const foundClass = await ClassSchema.findOne({$and: [{grade: grade}, {section: section}]});

    if(foundClass != null) {
        res.status(401).json({status: 401, message: "Class already exists", success: false });
    }else{
        // Check if the teacher id exists in the database
        const foundTeacher = await TeacherSchema.findOne({_id: teacherId});

        if(foundTeacher == null){
            res.status(401).json({status: 401, message: "Please select a valid teacher", success: false });
        }else{

            // For duplicate class teacher
            // var teacherAlreadyTeaching = await ClassSchema.findOne({classTeacher: teacherId});

            // if(teacherAlreadyTeaching != null) {
            //     return res.status(400).json({ status:400, message: "No duplicate class teacher", success: false });
            // }

            new ClassSchema({grade: grade, section: section, classTeacher: teacherId}).save().then((result) => {
                return res.status(200).json({status:200, success: true, message: "New class created"})
            }).catch((err) => {
                return res.status(400).json({ status:400, message: err, success: false });
            })
        }

    }

}