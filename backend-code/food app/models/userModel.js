const mongoose = require("mongoose");
const emailValidator = require("email-validator")
const {DB_LINK} = require("../secret")
//connnect server to the mongoDb
mongoose.connect(DB_LINK).then(function(db){
    console.log("connected to db");
}).catch(function(err){
    console.log(err)
})
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number
    },
    email:{
        type: String,
        required: true,
        unique:true,
        validate: function(){
            return emailValidator.validate(this.email);
        }
    },
    password: {
        type: String,
        required: true,
        minlength:6
    },
    confirmPassword:{
        type:String,
        required:true,
        minlength:6,
        validate: function(){
            return this.password == this.confirmPassword
        }
    },
    token: String,
    role: {
        type: String,
        enum: ["admin", "user", "manager"],
        default: "user"
    },
    createdAt:{
        type:String
    }
})
userSchema.pre('save' , function(){
    this.confirmPassword = undefined
})
userSchema.methods.resetHandler = function (password, confirmPassword) {
    this.password = password;
    this.confirmPassword = confirmPassword;
    // token reuse is not possible
    this.token = undefined;
}
const userModel = mongoose.model("userModel" , userSchema);
module.exports = userModel