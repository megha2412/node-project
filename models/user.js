const mongoose = require('mongoose');
const dotenv = require('dotenv');

const userSchema= new mongoose.Schema({
    userName:String,
    email:{type:String, required:true},
    password:String
})
 
module.exports = mongoose.model('User', userSchema);
