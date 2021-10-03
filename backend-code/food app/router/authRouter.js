const express = require("express");
const userModel = require("../models/userModel");
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_KEY } = require("../secret");
let emailSender = require("../helper/emailSender")
authRouter
.post("/signup", setCreatedAt, signupUser)
.post("/login", loginUser)
.post("/forgetPassword", forgetPassword)
.post("/resetPassword", resetPassword)
async function loginUser(req , res){
    try{
        if(req.body.email){
            let user = await userModel.findOne({email:req.body.email});
            if(user && user.password == req.body.password){
                let payload = user["_id"];
                let token = jwt.sign({ id: payload }, JWT_KEY);
                res.cookie("jwt", token, {
                    httpOnly: true,
                })
                res.status(200).json({
                    message:"user login",
                    loginUser : user
                })
            }else {
                res.status(401).json({
                    message:"invalid password or email"
                })
            }
        }else{
            res.status(401).json({
                message:"Please Enter an email"
            })
        }
        
        
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}
// middleware 

function setCreatedAt(req  , res , next){
    let body = req.body;
    let length = (Object.keys(req.body).length);
    if(length == 0){
        return res.status(400).json({
            message:"empry body"
        })
    }
    req.body.createdAt = new Date().toISOString();
    next();
}
async function signupUser(req ,res ){
    try{
        let userObj = req.body;
        let user = await userModel.create(userObj);
        console.log("user" , user);
        res.status(200).json({
            message:"created user",
            createdUser: user
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}
async function forgetPassword(req, res) {
    let email = req.body.email;
    let seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    // console.log(seq);
    try {
        if (email) {
            await userModel.updateOne({ email }, { token: seq });
            // email send to
            // nodemailer -> table tag through
            //  service -> gmail
            let user = await userModel.findOne({ email });
            await emailSender(seq, user.email);
            console.log(user);
            if (user?.token) {
                return res.status(200).json({
                    message: "Email send with token" + seq
                })
            } else {
                return res.status(404).json({
                    message: "user not found"
                })
            }
        } else {
            return res.status(400).json({
                message: "kindly enter email"
            })
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }
}
async function resetPassword(req, res) {
    let { token, password, confirmPassword } = req.body;
    try {
        if (token) {
            // findOne
            let user = await userModel.findOne({ token });
            if (user) {
                user.resetHandler(password, confirmPassword);
                // user.password = password;
                // user.confirmPassword = confirmPassword;
                // token reuse is not possible
                // user.token = undefined;
                console.log(user);
                await user.save();
                res.status(200).json({
                    message: "user password changed"
                })
            } else {
                return res.status(404).json({
                    message: "incorrect token"
                })
            }
        } else {
            return res.status(404).json({
                message: "user not found"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message
        })
    }

}

module.exports = authRouter