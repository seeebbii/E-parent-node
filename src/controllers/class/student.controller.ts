import StudentSchema from '../../schema/student/student_schema'
import express from 'express' 
import {Utils} from '../../service/utils'


// Student Controller methods for fetching complete student profile
exports.fetchStudentProfile = async (studentId: String) => {
    let student = await StudentSchema.findOne({_id: studentId});
    if(student != null) {
        student.age = Utils.getAge(student.dob);
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

    if(students != null && students.length != 0){
        // Calculating age of students on runtime
        students.forEach(e=> {e.age = Utils.getAge(e.dob)})
        return res.status(200).json({status:200, success: true, data: students})
    }else{
        return res.status(400).json({ status:400,  success: false , message: "No students added against your phone number"});
    }

}



exports.createStudent = async (req: express.Request, res: express.Response, next : express.NextFunction) => {

    let dob: Date = new Date(req.body.dob)
    const {full_name, parent_phone,} = req.body
    

    new StudentSchema({full_name: full_name, parent_phone: parent_phone, dob: dob}).save().then((response) => {
        response.age = Utils.getAge(dob)
        return res.status(200).json({status:200, success: true, message: "Student created successfully", data: response})

    }).catch((err) => {
    
        res.status(400).json({ status:400, success: false,  message: err.message, });
    });


}