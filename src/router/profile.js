const express = require('express')
const profileRouter = express.Router()
const {userAuth} = require('../utils/userAuth')
const user = require('../models/user')
const {validateProfile} = require('../utils/validate')
profileRouter.get('/profile/view',userAuth,async(req,res)=>{
    try{
        const userData = req.userData
        // const userData =await  user.findOne({email:req.body.email})
       if(!userData){
         throw new Error('token expired, please')
       }else{
        res.send(userData)
       }
    }catch(err){
        res.status(400).send('something went wrong: ' + err.message)
       }
})
profileRouter.post('/profile/edit/:userId',userAuth,async(req,res)=>{
  try{
    const {userId} = req.params
    const data = req.body
    const isValid = ['lastName','age','firstName',]
    let check = Object.keys(req.body).every((val)=>{
         return isValid.includes(val)
     })
     if(!check){
         throw new Error('updating is not possibel')
     }
     validateProfile(data)
  const userData =await user.findByIdAndUpdate(userId,data,{runValidators:true,returnDocument:'after'})
  if(!userData){
   throw new Error('Update not successfully')
  }
   res.json({message:'updated successfully',data:[userData]})
  }catch(err){
    res.status(400).json({message:err.message})
  }
})
module.exports = profileRouter