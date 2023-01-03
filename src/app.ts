import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import multer from "multer"

// ! Importing routes
import authRoutes from './routes/auth.routes'
import courseRoutes from './routes/course.routes'
import classRoutes from './routes/class.routes'
import teacherRoutes from './routes/teacher.routes'

// ! Importing controllers

const app = express();
const upload = multer(); 
dotenv.config();


app.use(cors(), (req, res, next) => { next() })

// ! Limiting the json request/response
app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(upload.any());


app.get('/api', (req, res, next) => {
    res.json({
        'message' : `Server is running at Port: ${process.env.PORT}`,
    })
})
mongoose.connect(process.env.MONGO_URI!, { useNewUrlParser: true } as mongoose.ConnectOptions).then(() => console.log('MongoDb Connected')).catch((err) => console.log(err))
app.listen(process.env.PORT, () => console.log(`Server is running at Port: ${process.env.PORT}`))


app.use('/api/auth', authRoutes)
app.use('/api/course', courseRoutes)
app.use('/api/class', classRoutes)
app.use('/api/teacher', teacherRoutes)