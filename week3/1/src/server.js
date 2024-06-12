import express from "express";
import { dbconnect } from "./config/database.config.js";
import adminRouter from "./routs/admin.js";
import userRouter from "./routs/user.js";
import morgan from "morgan";
import dotenv from "dotenv"
dotenv.config();

const app=express();
const port=process.env.PORT;

app.use(morgan());
app.use(express.json());

dbconnect();

app.use("/admin", adminRouter)
app.use("/user", userRouter)


app.listen(port,(err)=>{
    if (err) throw err;
    console.log(`Server is running on port ${port}`);
})