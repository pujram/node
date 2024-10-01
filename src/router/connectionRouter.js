const express = require('express')
const { userAuth } = require('../utils/userAuth')
const connectionRouter = express.Router()
const connectionModel = require('../models/connectionRequest')
const user = require('../models/user')
connectionRouter.post('/send/connection/request/:status/:userId',userAuth,async (req,res)=>{
    try{
        const {status,userId} = req.params
        const loggedInUser = req.userData
        const allowedStatus = ['interested','ignored']
        const isValidStatus = allowedStatus.includes(status)
        if(!isValidStatus){
            throw new Error('status is not valid')
        }
        const isValidUserId = await user.findById({_id:userId})
        if(!isValidUserId){
            throw new Error('userId is not valid')
        }

        const existConnection = await connectionModel.findOne({
           $or:[{fromUserId:loggedInUser._id,toUserId:userId},
            {fromUserId:userId,toUserId:loggedInUser._id}] 
        })

        if(existConnection){
            throw new Error('already connection exist')
        }
        const connectionData =new connectionModel({
            fromUserId:loggedInUser._id,
            toUserId:userId,
            status:status
        })
        await connectionData.save()
        res.send('connection sent successfully')
    }catch(err){
        res.status(400).send('something went wrong: ' + err.message)
    }
})
connectionRouter.post('/request/review/:status/:requestId',userAuth,async (req,res)=>{
    try{
        const loggedInUser = req.userData
        const {status,requestId} = req.params
        const allowedStatus = ['accepted','rejected']
       if(!allowedStatus.includes(status)){
         throw new Error('status is not valid')
       }
         const conRequest = await connectionModel.findById({_id:requestId})
         if(!conRequest){
            throw new Error("connection is not found")
         }
        const connectionData = await connectionModel.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
         })
         if(!connectionData){
            throw new Error("connection is not exist")
         }
         connectionData.status = status

         await connectionData.save()
         res.send(` ${loggedInUser.firstName} is ${status} request`)
    }catch(err){
         res.status(400).send("Error: " + err.message)
    }
})

module.exports = connectionRouter