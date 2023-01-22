import express from 'express' 
import ClassSchema from '../../schema/class/class_schema'
import TeacherSchema from '../../schema/teacher/teacher_schema'
import AuthSchema from '../../schema/auth/auth_schema'

exports.getAllTeachers = async (req: express.Request, res: express.Response, next : any) => {

    AuthSchema.find({role: 1}).then( async (result : Array<any>) => {
        var arr = [];

        for(const item of result){
           let teacher = await TeacherSchema.findOne({role_id: item['_id']});
           // Creating teacher's map          
           arr.push({
               "user": item,
               "teacherData": teacher,
           });
        }

        res.status(200).json({status:200, success: true, data: arr})
        
    }).catch((err) => {
        res.status(400).json({status:400, message: err, success: false });
    })

}


exports.addCourses = async (req: express.Request, res: express.Response, next : express.NextFunction) => {

    const {teacher_id, courses} = req.body
    //! find if the teacher exists

    let teacher = await TeacherSchema.findOne({_id: teacher_id});

    if(teacher != null){
        //! Add courses to teachers courses array

        teacher.updateOne({ $set: { course_teaches: courses } }).then((updateResponse) => {
            res.status(200).json({status:200, success: true, message: "Courses added successfully"})
        }).catch((err) => {
            res.status(400).json({ status:400, success: false,  message: err.message, });
        });

    }else{
        res.status(400).json({ status:400, success: false,  message: "Teacher does not exists", });
    }
}