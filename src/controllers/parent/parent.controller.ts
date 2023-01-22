import express from 'express' 
import ParentSchema from '../../schema/parent/parent_schema'
import StudentSchema from '../../schema/student/student_schema'


exports.addStudents = async (req: express.Request, res: express.Response, next : express.NextFunction) => {

    const {parent_id, students} = req.body
    //! find if the parent exists

    let parent = await ParentSchema.findOne({_id: parent_id});

    if(parent != null){
        //! Add students to parents student array

        parent.updateOne({ $set: { students: students } }).then((updateResponse) => {
            res.status(200).json({status:200, success: true, message: "Students added successfully"})
        }).catch((err) => {
            res.status(400).json({ status:400, success: false,  message: err.message, });
        });

    }else{
        res.status(400).json({ status:400, success: false,  message: "Parent does not exists", });
    }
}