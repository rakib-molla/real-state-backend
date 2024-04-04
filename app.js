import express from 'express';


// router import to router folder
import postRoute from "./routes/post.route.js" 
import authRoute from './routes/auth.route.js'

const app = express();
app.use(express.json());
const port = 8800


app.use('/api/posts', postRoute)
app.use('/api/auth', authRoute)




app.listen(port, () => {
 console.log(`Example app listening on port ${port}`)
})