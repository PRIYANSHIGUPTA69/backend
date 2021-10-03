const express = require("express");
const userModel = require("../models/userModel");
const userRouter = express.Router();
const protectedRoute = require("./authHelper")
userRouter
    .route("/")
    .get( protectedRoute , getUser)
    .post(createUser)
    .patch(updateUser)
    .delete(deletUser);



    function createUser(req, res) {
        console.log("req.data", req.body);
        user = req.body;
        res.status(200).send("data recieved and user added ");
    }
   async function getUser(req, res) {
       try{
        let user = await userModel.find()
        res.status(200).json({
            message:"list of all user",
            user
        });
       }catch(err){
           res.send(500).json({
               error:err.message,
               message:"can't get all users"
           })
       }
        
        // for sending key value pair
    }
    function updateUser(req, res) {
        let obj = req.body;
        for (let key in obj) {
            user[key] = obj[key];
        }
        res.status(200).json(user);
    }
    function deletUser(req, res) {
        user = {}
        res.status(200).json(user);
    }
    function getUserById(req, res) {
        console.log(req.params);
        res.status(200).send("Hello");
    }

  module.exports= userRouter