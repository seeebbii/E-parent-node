import express from 'express' 
import ClassSchema from '../../schema/class/class_schema'
import TeacherSchema from '../../schema/teacher/teacher_schema'
import AuthSchema from '../../schema/auth/auth_schema'
import CourseSchema from '../../schema/class/course_schema'
import { ObjectId } from 'mongodb'
import StudentSchema from '../../schema/student/student_schema'
import DiarySchema from '../../schema/class/diary_schema'
import { Utils } from '../../service/utils'

exports.getAll = async (req: express.Request, res: express.Response, next : any) => {

    ClassSchema.find().sort({grade: 1, section: 1}).then( async (result : any) => {

        for(var currentClass of result){

            var user = await AuthSchema.findOne({_id: currentClass.classTeacher});
            currentClass.studentsEnrolled = await StudentSchema.find({class_id: currentClass._id.toString()})

            for(var student of currentClass.studentsEnrolled){
                student.age = Utils.getAge(student.dob)
                let classItem = await ClassSchema.findOne({_id: student.class_id});
                classItem!.classTeacher = user
                student.class_id = classItem


                let currentIndex = 0
                for(var studentCourse of student.courses_enrolled){
                    student.courses_enrolled[currentIndex] = await CourseSchema.findOne({_id: studentCourse})
                    currentIndex++;
                }

            }

            // var teacherData = await TeacherSchema.findOne({role_id: user!._id}); 

            // let index = 0;
            // for(var course of teacherData?.course_teaches ?? []){
            //     teacherData!.course_teaches[index] = await CourseSchema.findOne({_id: course})
            //     index++;
            // }

            // var teacherDataMap = {
            //     "user":  user,
            //     "teacherData": teacherData

            // }

            currentClass.classTeacher = user
            
        }


        res.status(200).json({status:200, success: true, data: result})
    }).catch((err) => {
        res.status(400).json({status:400, message: err, success: false });
    })
    
}

exports.getAllById = async (req: express.Request, res: express.Response, next : any) => {
    var query = req.params.teacher_id;

    ClassSchema.find({classTeacher: query}).sort({grade: 1, section: 1}).then( async (result : any) => {

        for(var currentClass of result){

            var user = await AuthSchema.findOne({_id: currentClass.classTeacher});

            currentClass.studentsEnrolled = await StudentSchema.find({class_id: currentClass._id.toString()})

            for(var student of currentClass.studentsEnrolled){
                student.age = Utils.getAge(student.dob)
                let classItem = await ClassSchema.findOne({_id: student.class_id});
                classItem!.classTeacher = user
                student.class_id = classItem

                let currentIndex = 0
                for(var studentCourse of student.courses_enrolled){
                    student.courses_enrolled[currentIndex] = await CourseSchema.findOne({_id: studentCourse})
                    currentIndex++;
                }
            }
           
            // var teacherData = await TeacherSchema.findOne({role_id: user!._id}); 

            // let index = 0;
            // for(var course of teacherData?.course_teaches ?? []){
            //     teacherData!.course_teaches[index] = await CourseSchema.findOne({_id: course})
            //     index++;
            // }

            // var teacherDataMap = {
            //     "user":  user,
            //     "teacherData": teacherData

            // }

            currentClass.classTeacher = user
            
        }


        res.status(200).json({status:200, success: true, data: result})
    }).catch((err) => {
        res.status(400).json({status:400, message: err, success: false });
    })
    
}


exports.studentsInClass = async (req: express.Request, res: express.Response, next : any) => {
    var class_id = req.params.class_id;

    let students = await StudentSchema.find({class_id: class_id}).sort({full_name: 1});

    res.status(200).json({status:200, success: true, data: students})
}


exports.insert = async (req: express.Request, res: express.Response, next : any) => {

    const {grade, section, teacherId} = req.body;

    // Checking Duplicate Entries
    const foundClass = await ClassSchema.findOne({$and: [{grade: grade}, {section: section}]});

    if(foundClass != null) {
        res.status(401).json({status: 401, message: "Class already exists", success: false });
    }else{
        // Check if the teacher id exists in the database
        const foundTeacher = await AuthSchema.findOne({_id: teacherId});

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


exports.createDiary = async (req: express.Request, res: express.Response, next : any) => {

    const {class_id, diary, current_date} = req.body;

    // Find if the diary for current date and class has already been uploaded
    // If yes, then return the object and prompt the user for updating the diary

    let diaryResult = await DiarySchema.findOne({class_id: class_id, current_date: current_date})

    if(diaryResult != null) {
        return res.status(200).json({status:200, success: true, message: "Diary already exists"})
    }

    new DiarySchema({class_id: class_id, diary: diary, current_date: current_date}).save().then((result) => {
        return res.status(200).json({status:200, success: true, message: "Diary Created"})
    }).catch((err) => {
        return res.status(400).json({ status:400, message: err, success: false });
    })

}

exports.viewClassDiaries = async (req: express.Request, res: express.Response, next : any) => {
    const class_id = req.params.class_id;

    let diaries = await DiarySchema.find({class_id: class_id}).sort({current_date: -1}).limit(1);

    return res.status(200).json({status:200, success: true, data: diaries})
}

exports.viewTeacherClassDiaries = async (req: express.Request, res: express.Response, next : any) => {
    const {class_id} = req.body;

    let dataArr : Array<any> = [];
   
    if(class_id === undefined){
        return res.status(200).json({status:200, success: true, data: dataArr})
    }

    for(var classIds of class_id){
        let diary = await DiarySchema.find({class_id: classIds}).sort({current_date: -1}).limit(1);

        if(diary[0] != null){
            if(diary[0].class_id != null){
                let diaryClassId = diary[0].class_id

                console.log(diaryClassId.toString())

                let diaryClass = await ClassSchema.findOne({_id: diaryClassId})
                diaryClass!.classTeacher = await AuthSchema.findOne({_id: diaryClass!.classTeacher})
                diary[0].class_id = diaryClass;
                dataArr.push(diary[0]);
            }   
        }

        
    }


    // let diaries = await DiarySchema.find({class_id: class_id}).sort({current_date: -1});

    return res.status(200).json({status:200, success: true, data: dataArr})
}


exports.assignStudents =  async (req: express.Request, res: express.Response, next : any) => {

    const {student_ids, class_id} = req.body

    if(student_ids != null){
        for(var id of student_ids){
            await StudentSchema.updateOne({_id: id}, {class_id: class_id})
        }
    }

    return res.status(200).json({status:200, success: true, message: "Students Assigned Successfully!"})

}

exports.updateClassTeacher =  async (req: express.Request, res: express.Response, next : any) => {

    const {class_id, teacher_id} = req.body

    let classUpdateResponse = await ClassSchema.updateOne({_id: class_id}, {classTeacher: teacher_id});

    if(classUpdateResponse != null){
        return res.status(200).json({status:200, success: true, message: "Class teacher updated successfully"})
    }else{
        return res.status(404).json({status:404, success: false, message: "Unable to update class teacher"})
    }

}