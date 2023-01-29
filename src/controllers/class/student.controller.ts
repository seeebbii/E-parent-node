import StudentSchema from '../../schema/student/student_schema'
import CourseSchema from '../../schema/class/course_schema'
import ClassSchema from '../../schema/class/class_schema'
import express from 'express' 
import {Utils} from '../../service/utils'
import AuthSchema from '../../schema/auth/auth_schema'


// Student Controller methods for fetching complete student profile
exports.fetchStudentProfile = async (studentId: String) => {
    let student = await StudentSchema.findOne({_id: studentId});
    if(student != null) {
        student.age = Utils.getAge(student.dob);

        // Fetch courses enrolled and class id

        if(student.class_id != null) {
            let classObject = await ClassSchema.findOne({_id: student.class_id}) 
            classObject!.classTeacher = await AuthSchema.findOne({_id: classObject!.classTeacher})
            student.class_id = classObject
        }

        if(student.courses_enrolled.length > 0){
            let index = 0;
            for(var course of student.courses_enrolled){
                student.courses_enrolled[index] = await CourseSchema.findOne({_id: course})
                index++;
            }
        }

    }

    return new StudentSchema(student);
}


async function fetchStudentProfileFunction(studentId: String) : Promise<any> {
    let student = await StudentSchema.findOne({_id: studentId});
    if(student != null) {
        student.age = Utils.getAge(student.dob);

        // Fetch courses enrolled and class id

        if(student.class_id != null) {
            let classObject = await ClassSchema.findOne({_id: student.class_id}) 
            classObject!.classTeacher = await AuthSchema.findOne({_id: classObject!.classTeacher})
            student.class_id = classObject
        }

        if(student.courses_enrolled.length > 0){
            let index = 0;
            for(var course of student.courses_enrolled){
                student.courses_enrolled[index] = await CourseSchema.findOne({_id: course})
                index++;
            }
        }

    }

    return new StudentSchema(student);
}

// Api endpoints functions 

exports.getAll = async (req: express.Request, res: express.Response, next : express.NextFunction) => {

    let students: Array<any> = await StudentSchema.find();
    if(students != null && students.length != 0){
        // Calculating age of students on runtime
        students.forEach(e=> {e.age = Utils.getAge(e.dob)})
        return res.status(200).json({status:200, success: true, data: students})
    }else{
        return res.status(400).json({ status:400,  success: false , data: students});
    }
}


exports.getMyStudents = async (req: express.Request, res: express.Response, next : express.NextFunction) => {

    const parentsPhone = req.params.phone;

    let students: Array<any> = await StudentSchema.find({parent_phone: parentsPhone});
    let fetchedStudentsArray: Array<any> = [];

    if(students != null && students.length != 0){
        // Calculating age of students on runtime
        students.forEach(e=> {e.age = Utils.getAge(e.dob)})

        for(var student of students){
            fetchedStudentsArray.push(await fetchStudentProfileFunction(student._id))
        }

        return res.status(200).json({status:200, success: true, data: fetchedStudentsArray})
    }else{
        return res.status(400).json({ status:400,  success: false , message: "No students added against your phone number"});
    }

}



exports.createStudent = async (req: express.Request, res: express.Response, next : express.NextFunction) => {

    let dob: Date = new Date(req.body.dob)
    const {full_name, parent_phone, class_id} = req.body
    

    new StudentSchema({full_name: full_name, parent_phone: parent_phone, dob: dob}).save().then( async (response) => {
        response.age = Utils.getAge(dob)

        // Update current student's class id
        await response.updateOne({class_id: class_id})

        return res.status(200).json({status:200, success: true, message: "Student created successfully",})

    }).catch((err) => {
    
        res.status(400).json({ status:400, success: false,  message: err.message, });
    });


}


exports.manageEnrollment = async (req: express.Request, res: express.Response, next : express.NextFunction) => {

    // let enrolledStudents = await StudentSchema.find({courses_enrolled: {$exists: true, $not: {$size: 0}}})

    let query = req.params.query;
    if(query == null){
        query  = ' ';
    }

    let enrolledStudents = await StudentSchema.find({$or: [ {full_name: {$regex: query.toString(), $options:'i'},}, {parent_phone: {$regex: query.toString(), $options:'i'},} ] },).sort({full_name: 1})


    for(var enrolled of enrolledStudents){
        let index = 0;

        if(enrolled.class_id != null){
            let classItem =  await ClassSchema.findOne({_id: enrolled.class_id}) 

            classItem!.classTeacher = await AuthSchema.findOne({_id: classItem!.classTeacher})
            enrolled.class_id = classItem;
        }

        for(var course of enrolled.courses_enrolled){
            
            enrolled.courses_enrolled[index] = await CourseSchema.findOne({_id: course})
            index++;
        }
    }


    res.status(200).json({status:200, success: true, data: enrolledStudents})
}


exports.insertCourses = async (req: express.Request, res: express.Response, next : express.NextFunction) => {

    const {student_id, courses} = req.body
    //! find if the student exists

    let student = await StudentSchema.findOne({_id: student_id});

    if(student != null){
        //! Add Courses to student enrolled courses array

        student.updateOne({ $set: { courses_enrolled: courses } }).then((updateResponse) => {
            res.status(200).json({status:200, success: true, message: "Courses added successfully"})
        }).catch((err) => {
            res.status(400).json({ status:400, success: false,  message: err.message, });
        });

    }else{
        res.status(400).json({ status:400, success: false,  message: "Student does not exists", });
    }

}




