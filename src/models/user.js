const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new  mongoose.Schema({
    firstName:{
        type:String,
        minLength:4,
        maxLength:40,
        required:true,
        trim:true
        
    },
    lastName:{
        type:String,
        minLength:4,
        maxLength:50,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        validate:(value)=>{
          return validator.isEmail(value)
        }
    },
    password:{
        type:String,
        minLength:5,
        maxLength:100
    },
    age:{
        type:Number,
        min:18,
        max:70
    }
},{timestamps:true})

userSchema.methods.jwtToken = async function (){
    const userData = this
   const token = await jwt.sign({_id:userData._id},'chepanubrother')
   return token
}
userSchema.methods.validPassword = async function (password){
    const userData = this
    const isPassword = await bcrypt.compare(password,userData.password)
    return isPassword
}
const user = mongoose.model('User',userSchema)

module.exports = user