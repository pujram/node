
const mongoose = require('mongoose')

const connectionRequestSchema =mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:['ignored','interested','accepted','rejected'],
            message:'{VALUE} status is not valid'
        }
    }

},{timestamps:true})
connectionRequestSchema.pre("save",function (next){
const connectionReq = this
   if(connectionReq.fromUserId.equals(connectionReq.toUserId)){
    throw new Error("cannot send request to yourself!!")
   }
    next()
})
const connectionModel =mongoose.model('connectionRequest',connectionRequestSchema)
module.exports = connectionModel