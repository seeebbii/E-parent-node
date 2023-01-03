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
        res.status(400).json({status:400, messgae: err, success: false });
    })

}