import express from 'express' 
import ClassSchema from '../../schema/class/class_schema'
import CourseSchema from '../../schema/class/course_schema'
import TeacherSchema from '../../schema/teacher/teacher_schema'
import AuthSchema from '../../schema/auth/auth_schema'
import { ObjectId, ObjectID } from 'bson'

function searchQuery(query: String, array: Array<any>): Array<any> {
    var searchedArray = [];
    for (let i=0; i < array.length; i++) {
        

        if(array[i].full_name.toString().toLowerCase().startsWith(query.toLowerCase())){
            searchedArray.push(array[i]);
        }
        else if(array[i].complete_phone.toString().toLowerCase().startsWith(query.toLowerCase())){
            searchedArray.push(array[i]);
        }

    }
    return searchedArray
}

exports.getAllTeachers = async (req: express.Request, res: express.Response, next : any) => {

    // let query = req.params.query;
    // if(query == null){
    //     query  = '';
    // }

    const dataArr: Array<any> = [];

    var arr: Array<any> = await AuthSchema.find({role: 1, admin:false});

    // if(query!=null){arr = searchQuery(query, arr);}
    

    for(var teacher of arr){
        // console.log(new ObjectId(teacher._id))

        var teacherData = await TeacherSchema.findOne({role_id: new ObjectId(teacher._id)});
       

        let courseIndex = 0;
        for(var teacherCourse of teacherData?.course_teaches ?? []){
            teacherData!.course_teaches[courseIndex] = await CourseSchema.findOne({_id: teacherCourse})
            courseIndex++
        }

        if(teacherData != null){
            dataArr.push({
                "user": teacher,
                "teacherData": teacherData
             });
        }

        

    }

    // AuthSchema.find({$or: [ {full_name: {$regex: query.toString(), $options:'i'},}, {complete_phone: {$regex: query.toString(), $options:'i'},} ] },).sort({full_name: 1}).then( async (result : Array<any>) => {
      

    //     for(const item of result){
    //        let teacher = await TeacherSchema.findOne({role_id: item._id});
    //        let index = 0;
    //        for(var t of teacher!.course_teaches){
    //         teacher!.course_teaches[index] = await CourseSchema.findOne({_id: t})
    //         index++;
    //        }

    //        // Creating teacher's map          
    //        arr.push({
    //            "user": item,
    //            "teacherData": teacher,
    //        });
    //     }

        
        
    // }


    res.status(200).json({status:200, success: true, data: dataArr})

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