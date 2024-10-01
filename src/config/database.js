const mongoose = require('mongoose')



const connectDB = async ()=>{

   await mongoose.connect('mongodb+srv://ramPujari:7kdXLxNklbZNrUwe@learnfullstack.xz97h.mongodb.net/namasteTinder')
} 

module.exports = connectDB