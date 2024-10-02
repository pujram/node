
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
userRouter.get('/feed', userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.userData
        const connectionData = await connectionModel.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]
        })
        let connectionSet = new Set()

        connectionData.forEach((val)=>{
           connectionSet.add(val.fromUserId.toString())
           connectionSet.add(val.toUserId.toString())
        })
        const feedData = await user.find({
           $and:[{_id:{$nin:Array.from(connectionSet)}},{_id:{$ne:loggedInUser._id}}]
        }).select("firstName lastName age")
        
        res.json({message:'feed data' , data:feedData})
    }catch(err){
        res.status(400).send('something went wrong: '+err.message)
    }
})


module.exports = userRouter