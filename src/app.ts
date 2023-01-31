import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import multer from "multer"
import {SocketHandler} from './service/socket_handler'

// ! Importing routes
import authRoutes from './routes/auth.routes'
import courseRoutes from './routes/course.routes'
import classRoutes from './routes/class.routes'
import teacherRoutes from './routes/teacher.routes'
import parentRoutes from './routes/parent.routes'
import studentRoutes from './routes/student.routes'
import chatRoutes from './routes/chat.routes'
import path from 'path'

// ! Importing controllers

const app = express();
const upload = multer(); 
dotenv.config();


app.use(cors(), (req, res, next) => { next() })

// ! Limiting the json request/response
app.use(upload.any());
app.use(bodyParser.json({ limit: '1000mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/api', (req, res, next) => {
    res.json({
        'message' : `Server is running at Port: ${process.env.PORT}`,
    })
})
mongoose.connect(process.env.MONGO_URI!, { useNewUrlParser: true } as mongoose.ConnectOptions).then(() => console.log('MongoDb Connected')).catch((err) => console.log(err))
const httpServer = app.listen(process.env.PORT, () => console.log(`Server is running at Port: ${process.env.PORT}`))

// ! Creating socket handler class
new SocketHandler(httpServer);
SocketHandler.handleConnection()


// const io = new socketio.Server(httpServer, { allowEIO3: true } as socketio.ServerOptions);


app.use('/api/auth', authRoutes)
app.use('/api/course', courseRoutes)
app.use('/api/class', classRoutes)
app.use('/api/teacher', teacherRoutes)
app.use('/api/parent', parentRoutes)
app.use('/api/student', studentRoutes)
app.use('/api/chat', chatRoutes)