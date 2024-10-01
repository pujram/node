
const validator = require('validator')
const validateUtils = (req)=>{
   const {email,firstName,password,lastName} = req.body
   const regex = /[^a-zA-Z\s]/g;
   const isFirstName = firstName.match(regex)
   if(isFirstName){
      throw new Error('firstName is not valid')
   }
   if(lastName){
      const regex = /[^a-zA-Z\s]/g;
      const isLastName = lastName.match(regex)
      if(isLastName){
         throw new Error('lastName is not valid')
      }
    }
   const validEmail = validator.isEmail(email)
   const validPassword = validator.isStrongPassword(password)
   if(!validEmail){
    throw new Error('email is not valid')
   }
   if(!validPassword){
      throw new Error('password in not valid')
   }

}
const validateProfile = (req)=>{
    if(req?.firstName){
      const regex = /[^a-zA-Z\s]/g;
      const isFirstName = req?.firstName.match(regex)
      if(isFirstName){
         throw new Error('firstName is not valid')
      }
    }
    if(req?.lastName){
      const regex = /[^a-zA-Z\s]/g;
      const isLastName = req?.lastName.match(regex)
      if(isLastName){
         throw new Error('lastName is not valid')
      }
    }
}

module.exports = {validateUtils,validateProfile}