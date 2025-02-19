import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import mainRouter from './Routes/indexRoute.js'



const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(cookieParser())

//morgan logger
app.use(morgan('tiny'))

// routes
app.use("/api/v1", mainRouter);



export default app