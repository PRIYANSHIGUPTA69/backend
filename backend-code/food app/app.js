const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const userModel = require("./models/userModel");
const userRouter = require("./router/userRouter");
const authRouter = require("./router/authRouter")
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
// import router

// /api/user/:id
app.use('/api/user', userRouter);
app.use("/api/auth", authRouter);


app.listen(8000, () => {
    console.log("server connected");
})
