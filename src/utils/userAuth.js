
const jwt = require('jsonwebtoken')
const user = require('../models/user')

const userAuth = async (req,res,next)=>{
    try{
    const {token} = req.cookies
    if(!token){
        throw new Error('token is not found')
    }
   const decodeId =  await jwt.verify(token,"chepanubrother")
   const userData = await user.findById({_id:decodeId._id})
   if(!userData){
    throw new Error('token expired')
   }
   req.userData = userData
   next()
}catch(err){
    res.status(400).send('something went Wrong: ' + err.message)
}
}
module.exports = {
    userAuth
}
