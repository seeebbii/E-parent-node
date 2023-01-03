import jsonwebtoken from 'jsonwebtoken'
import express from 'express';
import * as fs from 'fs';
import AuthSchema from '../schema/auth/auth_schema'
import ParentSchema from '../schema/parent/parent_schema'
import TeacherSchema from '../schema/teacher/teacher_schema'
import { json } from 'body-parser';

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
                        TeacherSchema.findOne({role_id: auth._id}).then((teacher: any) => {
                            res.status(200).json({status: 200, success: true, message: "Login successful!", token: token, teacherData: teacher, user: auth });
                        });
                    }else{
                        // Return Parent's Object
                        ParentSchema.findOne({role_id: auth!._id}).then((parent: any) => {
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