import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'

// ! Importing routes
import authRoutes from './routes/auth.routes'

// ! Importing controllers

const app = express();
dotenv.config();


app.use(cors(), (req, res, next) => { next() })

// ! Limiting the json request/response
app.use(express.json({ limit: '1000mb' }));


app.get('/', (req, res, next) => {
    res.json({
        'message' : `Server is running at Port: ${process.env.PORT}`,
    })
})
mongoose.connect(process.env.MONGO_URI!, { useNewUrlParser: true } as mongoose.ConnectOptions).then(() => console.log('MongoDb Connected')).catch((err) => console.log(err))
app.listen(process.env.PORT, () => console.log(`Server is running at Port: ${process.env.PORT}`))


app.use('/api/auth', authRoutes)