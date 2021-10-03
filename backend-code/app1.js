const express = require("express");
const app = express();
app.use(express.json()); // it accept post req data in req.body
app.get("/" , (req , res) => {
    res.send('<h1>hello</h1>')
})
let user = {
    
}
app.post("/user" , (req , res) => {
    console.log("req.body" , req.body);
    user = req.body
    res.status(200).send("data rec")

})
// get user
app.get("/user" , (req , res) => {
    console.log(user);
    res.json(user)
})
//update the user
app.patch("/user" , (req , res) => {
    let obj =req.body;
    for(let key in obj){
        user[key] = obj[key];
    }
    res.status(200).json(user)
})
//delete user
app.delete("/user" , (req , res) => {
    user={};
    res.status(200).json(user);
})
app.get("/user/:id" , (req , res) => {
    console.log(req.params);
    res.status(200).send("hello")
})
app.listen(8000, () => {
    console.log("server connected");
})