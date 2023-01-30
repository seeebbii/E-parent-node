import express from 'express' 
import ClassSchema from '../../schema/class/class_schema'
import TeacherSchema from '../../schema/teacher/teacher_schema'
import AuthSchema from '../../schema/auth/auth_schema'
import CourseSchema from '../../schema/class/course_schema'
import { ObjectId } from 'mongodb'
import StudentSchema from '../../schema/student/student_schema'
import DiarySchema from '../../schema/class/diary_schema'
import AttendanceSchema from '../../schema/class/attendance_schema'
import NotificationSchema from '../../schema/notification/notification_schema'
import { Utils } from '../../service/utils'
import LeaveSchema from '../../schema/class/leave_schema'
import FirebaseAdminHelper from '../../service/firebase_admin_helper'


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

    // let diaryResult = await DiarySchema.findOne({class_id: class_id, current_date: current_date})

    // if(diaryResult != null) {
    //     return res.status(200).json({status:200, success: true, message: "Diary already exists"})
    // }

    await DiarySchema.updateMany({class_id: class_id, current_date: current_date}, {diary: diary, class_id: class_id, current_date: current_date}, {upsert: true}).then((result) => {
        return res.status(200).json({status:200, success: true, message: "Diary Uploaded"})
    }).catch((err) => {
        return res.status(400).json({ status:400, message: err, success: false });
    })

}

exports.viewDiaryByDate =  async (req: express.Request, res: express.Response, next : any) => {
    const {diary_date, class_id} = req.body


    let diary = await DiarySchema.findOne({class_id: class_id, current_date: diary_date});

    console.log(diary)

    if(diary == null ){
        return res.status(200).json({status:200, success: false, message: ""})
    }

    let classObj = await ClassSchema.findOne({_id: diary.class_id});
    classObj!.classTeacher = await AuthSchema.findOne({_id: classObj!.classTeacher})
    diary.class_id = classObj;

    return res.status(200).json({status:200, success: true, data: diary})

}

exports.viewClassDiaries = async (req: express.Request, res: express.Response, next : any) => {
    const class_id = req.params.class_id;

    let diaries = await DiarySchema.find({class_id: class_id}).sort({current_date: -1}).limit(1);
    
    for(let diary of diaries){
        let classObj = await ClassSchema.findOne({_id: diary.class_id});
        classObj!.classTeacher = await AuthSchema.findOne({_id: classObj!.classTeacher})
        diary.class_id = classObj
    }

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

exports.uploadClassAttendance = async (req: express.Request, res: express.Response, next : any) => {

    const {students} = req.body;

    for(var student of students){

        await AttendanceSchema.updateOne({attendance_date: student.attendance_date, student_id: student.student_id, class_id: student.class_id}, 
            {class_id: student.class_id, student_id: student.student_id, attendance_date: student.attendance_date, attendance_status: student.attendance_status},
            {upsert: true})

    }


    // if current date attendance already exists, update all attendance

    // await AttendanceSchema.updateMany({attendance_date: attendance_date}, {$set : })

    return res.status(200).json({status:200, success: true, message: "Attendance uploaded"})

}

exports.viewClassAttendance =  async (req: express.Request, res: express.Response, next : any) => {

    const {attendance_date, class_id} = req.body

    let attendance = await AttendanceSchema.find({class_id: class_id, attendance_date: attendance_date});

    if(attendance == null || attendance.length <= 0){
        return res.status(200).json({status:200, success: false, data: []})
    }

    return res.status(200).json({status:200, success: true, data: attendance})

}

exports.viewStudentAttendance =  async (req: express.Request, res: express.Response, next : any) => {
    const {attendance_date, class_id, student_id} = req.body

    let attendance = await AttendanceSchema.find({student_id: student_id, class_id: class_id, attendance_date: attendance_date});

    if(attendance == null || attendance.length <= 0){
        return res.status(200).json({status:200, success: false, data: []})
    }

    return res.status(200).json({status:200, success: true, data: attendance})
}

exports.viewAllRequests =  async (req: express.Request, res: express.Response, next : any) => {
    const {class_id, teacher_id} = req.body

    let requests = await LeaveSchema.find({class_id: class_id, teacher_id: teacher_id,}).sort({createdAt: -1});

    if(requests != null) {

        for(var request of requests){
            let student = await StudentSchema.findOne({_id: request.student_id});
            let classObject = await ClassSchema.findOne({_id: student!.class_id})
            classObject!.classTeacher = await AuthSchema.findOne({_id: classObject!.classTeacher})
            student!.class_id = classObject
            student!.courses_enrolled = []
            let parent = await AuthSchema.findOne({_id: request.parent_id});


            request.student_id = student
            request.parent_id = parent
        }

    }


    return res.status(200).json({status:200, success: true, data: requests})
}

exports.viewParentRequestLeaves =  async (req: express.Request, res: express.Response, next : any) => {
    const {student_id, parent_id} = req.body


    let requests = await LeaveSchema.find({student_id: student_id, parent_id: parent_id,}).sort({createdAt: -1});

    if(requests != null) {

        for(var request of requests){
            let student = await StudentSchema.findOne({_id: request.student_id});
            let classObject = await ClassSchema.findOne({_id: student!.class_id})
            classObject!.classTeacher = await AuthSchema.findOne({_id: classObject!.classTeacher})
            student!.class_id = classObject
            student!.courses_enrolled = []
            let parent = await AuthSchema.findOne({_id: request.parent_id});


            request.student_id = student
            request.parent_id = parent
        }

    }


    return res.status(200).json({status:200, success: true, data: requests})

    
}


exports.requestLeave =  async (req: express.Request, res: express.Response, next : any) => {

    const {parent_id, class_id, teacher_id, student_id, reason_for_leave, date_for_leave} = req.body

    let parent = await AuthSchema.findOne({_id: parent_id})
    let teacher = await AuthSchema.findOne({_id: teacher_id})
    let student = await StudentSchema.findOne({_id: student_id})

    let requestResponse = await new LeaveSchema(req.body).save();

    console.log(teacher)

    if(requestResponse != null) {


        const notification_options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };
    
        const message_payload = Utils.formatNotificationMessage(`You have a new Leave Request`,
        `You received a leave request for student ${student?.full_name} from parent: ${parent?.full_name}`);
    
    
        FirebaseAdminHelper.messaging().sendToDevice(teacher!.fcm_token, message_payload, notification_options);

        await new NotificationSchema({sent_by: parent_id, sent_to: teacher_id, notification_type: "Leave", title: message_payload.notification.title, description: message_payload.notification.body,}).save()

        return res.status(200).json({status:200, success: true, message: "Your request have been submitted"})
    }else{

        return res.status(400).json({status:400, success: false, message: "Unable to process your request"})
    }


}


exports.acceptRequestLeave =  async (req: express.Request, res: express.Response, next : any) => {
    const {leave_id, parent_id, teacher_id, student_id} = req.body

    let parent = await AuthSchema.findOne({_id: parent_id});
    let student = await StudentSchema.findOne({_id: student_id});


    let leaveResponse = await LeaveSchema.updateOne({_id: leave_id}, {leave_status: true});

    if(leaveResponse != null) {

        const notification_options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };
    
        const message_payload = Utils.formatNotificationMessage(`Leave Request Status`, `Your leave request has been approved for student ${student?.full_name}`);
    
    
        FirebaseAdminHelper.messaging().sendToDevice(parent!.fcm_token, message_payload, notification_options);

        await new NotificationSchema({sent_by: teacher_id, sent_to: parent_id, notification_type: "Leave", title: message_payload.notification.title, description: message_payload.notification.body,}).save()

        return res.status(200).json({status:200, success: true, message: "Leave Request Accepted"})
    }else{
        return res.status(400).json({status:400, success: false, message: "Server error"})
    }

}

exports.rejecttRequestLeave =  async (req: express.Request, res: express.Response, next : any) => {
    const {leave_id, parent_id, teacher_id, student_id} = req.body

    let parent = await AuthSchema.findOne({_id: parent_id});
    let student = await StudentSchema.findOne({_id: student_id});


    let leaveResponse = await LeaveSchema.updateOne({_id: leave_id}, {leave_status: false});

    if(leaveResponse != null) {

        const notification_options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };
    
        const message_payload = Utils.formatNotificationMessage(`Leave Request Status`, `Your leave request has been rejected for student ${student?.full_name}`);
    
    
        FirebaseAdminHelper.messaging().sendToDevice(parent!.fcm_token, message_payload, notification_options);

        await new NotificationSchema({sent_by: teacher_id, sent_to: parent_id, notification_type: "Leave", title: message_payload.notification.title, description: message_payload.notification.body,}).save()

        return res.status(200).json({status:200, success: true, message: "Leave Request Rejected"})
    }else{
        return res.status(400).json({status:400, success: false, message: "Server error"})
    }
}


exports.fetchParent = async (req: express.Request, res: express.Response, next : any) => {

    const {phone_number} = req.body


    let data = await AuthSchema.findOne({complete_phone: phone_number});

    return res.status(200).json({status:200, success: true, data: data})

}