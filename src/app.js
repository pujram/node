const express = require('express')
const app = express()
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.json())
const userRouter = require('./router/user')
const authRouter = require('./router/auth')
const profileRouter = require('./router/profile')
 const connectionRouter = require('./router/connectionRouter')
app.use('/',userRouter)
app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',connectionRouter)
connectDB().then((res)=>{
  console.log('db is connected successfully')
  app.listen(7777,()=>{
    console.log('server is Listening on port 7777')
})
}).catch((err)=>{
    console.log('error')
})

