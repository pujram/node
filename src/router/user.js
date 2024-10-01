
const express = require('express')
const userRouter =express.Router()
const user = require('../models/user')
const {userAuth} = require('../utils/userAuth')
const connectionModel = require('../models/connectionRequest')

userRouter.get('/user/requests/received',userAuth, async (req,res)=>{
    try{
         const loggedInUser = req.userData
        const connectionData = await connectionModel.find({
            toUserId:loggedInUser._id,
            status:"interested"
         }).select("status").populate("fromUserId",["firstName","lastName"])
         res.json({message:`${connectionData.length} request received ` ,data:connectionData})
    }catch(err){
        res.status(400).send('Error: '+err.message)
    }
})
userRouter.get('/user/connections',userAuth,async (req,res)=>{
    try{
        const loggedInUser = req.userData
       const userConnections = await connectionModel.find({
        $or:[{fromUserId:loggedInUser._id,status:'accepted'},{toUserId:loggedInUser._id,status:'accepted'}]
        }).select("status fromUserId toUserId").populate("fromUserId",["firstName","lastName","age"])
        res.send(userConnections)
    }catch(err){
        res.status(400).send('something went wrong: '+err.message)
    }
})
userRouter.get('/user/getAllUsers',userAuth, async(req,res)=>{
    try{

        const userData =await  user.find({})
        if(!userData){
            throw new Error('No Data found')
        }
        res.send(userData)
    }catch(err){
        res.status(400).send('something went wrong: '+err.message)
    }
})
userRouter.delete('/user/delete', userAuth, async (req,res)=>{
      const userId = req.body.userId
    try{
       const userData = await user.findByIdAndDelete(userId)
       if(!userData){
        throw new Error('delete is not possible')
       }
        res.send('data deleted successfully')
    }catch(err){
        res.status(400).send('something went wrong: '+err.message)
    }
})

module.exports = userRouter