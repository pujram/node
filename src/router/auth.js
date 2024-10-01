const express = require('express')
const authRouter = express.Router()
const {validateUtils} = require('../utils/validate')
const bcrypt = require('bcrypt')
const user = require('../models/user')
authRouter.post('/signUp',async (req,res)=>{
       
    try{
     const {password,email,firstName,lastName,age} = req.body
       validateUtils(req)
     const hashPassword = await bcrypt.hash(password,7)
        const userModel = new user({firstName,lastName,email,age,password:hashPassword})
        await userModel.save()
        res.send('data saved')
    }catch(err){
     res.status(400).send('something went wrong: ' + err.message)
    }
})
authRouter.post('/login',async(req,res)=>{
 try{
     const {email,password} = req.body
    const userData =  await user.findOne({email:email})
    if(!userData){
     throw new Error("inavlid credentials email")
    }

      const isPasswordValid = await userData.validPassword(password)
      if(isPasswordValid){
        const jwts =  await userData.jwtToken()
          res.cookie('token',jwts,{expires:new Date(Date.now() + 8 * 3600000)})
         res.send('successfully login')
         
      }
      else{
        res.status(400).send("invalid credentials password")
      }

 }catch(err){
     res.status(400).send('something went wrong: ' + err.message)
    }
})
authRouter.post('/logout',(req,res)=>{
  res.cookie('token',null,{expires:new Date(Date.now())})
  res.send('logout success')
})
module.exports = authRouter