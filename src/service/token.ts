import jsonwebtoken from 'jsonwebtoken'
import express from 'express';
import * as fs from 'fs';
import AuthSchema from '../schema/auth/auth_schema'
import ParentSchema from '../schema/parent/parent_schema'
import StudentsSchema from '../schema/student/student_schema'
import TeacherSchema from '../schema/teacher/teacher_schema'
import { Utils } from '../service/utils'
const studentController = require('../controllers/class/student.controller')
const courseController = require('../controllers/class/course.controller')

class Token {
 
    static generateToken(payload: Object)  {
        var privateKey = fs.readFileSync('private.key');
        var token = jsonwebtoken.sign({ user: payload }, privateKey, { expiresIn: "100d",  });
        return token;
    }

    static verifyToken(req: express.Request, res: express.Response, next : any){
        var privateKey = fs.readFileSync('private.key');
        let token = req.get('authorization');
        if (token) {
            token = token.replace('Bearer ', '');
            jsonwebtoken.verify(token, privateKey, (err, decoded) => {
                if (err) {
                    res.status(400).json({
                        status: 400,
                        success: false,
                        message: err.message,
                    });
                } else {
                    next();
                }
            });
        } else {
            res.status(401).json({
                status: 401,
                success: false,
                message: 'Access Denied: Unauthorized user',
            })
        }
    }


    static fetchProfile(req: express.Request, res: express.Response, next : any){
        var privateKey = fs.readFileSync('private.key');
        let token = req.get('authorization');
        if (token) {
            token = token.replace('Bearer ', '');
            jsonwebtoken.verify(token, privateKey, (err, decoded) => {
                if (err) {
                    res.status(400).json({
                        status: 400,
                        success: false,
                        message: err.message,
                    });
                } else {
                    // parsing JWT payload
                    var parsedObject = JSON.stringify(decoded)
                    var auth = new AuthSchema(JSON.parse(parsedObject)['user'])
                    if(auth?.role == 1){
                        // Return Teacher's Object
                        TeacherSchema.findOne({role_id: auth._id}).then( async (teacher: any) => {

                            if(teacher.course_teaches.length > 0){

                                // Call fetch course function from courseController

                                let fetchedTeacher: Array<Object> = []

                                for(var id of teacher.course_teaches){
                                    
                                    let course = await courseController.fetchCourseById(id);
                                    if(course != null) {
                                        fetchedTeacher.push(course)
                                    }
                                }
                                teacher.course_teaches = fetchedTeacher;
                            }

                            res.status(200).json({status: 200, success: true, message: "Login successful!", token: token, teacherData: teacher, user: auth });
                        });

                    }else{
                        // Return Parent's Object
                        ParentSchema.findOne({role_id: auth!._id}).then( async (parent: any) => {
                            // Check if the parent->students is not empty

                            if(parent.students.length > 0){

                                // Call fetch student profile function from studentController

                                let fetchedStudents: Array<Object> = []

                                for(var id of parent.students){

                                    // let student = await studentController.fetchStudentProfile(id);
                                    let student = await studentController.fetchStudentProfile(id);
                                    if(student != null) {
                                        fetchedStudents.push(student)
                                    }
                                }
                                parent.students = fetchedStudents;
                            }

                            res.status(200).json({status: 200, success: true, message: "Login successful!", token: token, parentData: parent, user: auth })

                        });
                    } 

                }
            });
        } else {
            res.status(401).json({
                status: 401,
                success: false,
                message: 'Access Denied: Unauthorized user',
            })
        }
    }

    static checkAdminRights(req: express.Request, res: express.Response, next : any){
        var privateKey = fs.readFileSync('private.key');
        let token = req.get('authorization');
        if (token) {
            token = token.replace('Bearer ', '');
            jsonwebtoken.verify(token, privateKey, (err, decoded) => {
                if (err) {
                    res.status(400).json({
                        status: 400,
                        success: false,
                        message: err.message,
                    });
                } else {
                    // parsing JWT payload
                    var parsedObject = JSON.stringify(decoded)
                    var authSchema = new AuthSchema(JSON.parse(parsedObject)['user'])
                    // Check if the user has the admin role or not
                    if(authSchema.admin === true){
                        next();
                    }else{
                        res.status(200).json({
                            status: 400,
                            success: false,
                            message: "Access Denied: User not admin",
                        });
                    }
                }
            });
        } else {
            res.status(401).json({
                status: 401,
                success: false,
                message: 'Access Denied: Unauthorized user',
            })
        }
    }

}

export default Token;