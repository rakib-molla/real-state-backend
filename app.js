import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';


// router import to router folder
import postRoute from "./routes/post.route.js" 
import authRoute from './routes/auth.route.js'
import testRoute from './routes/test.route.js'
import userRoute from './routes/user.route.js'


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))
const port = 8800


app.use('/api/auth', authRoute)
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute)
app.use('/api/test', testRoute)




app.listen(port, () => {
 console.log(`Example app listening on port ${port}`)
})