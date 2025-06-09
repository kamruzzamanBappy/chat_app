import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";

//Create Express app & Http server
const app = express();
const server = http.createServer(app)


//Middleware set up
app.use(express.json({limit: "4mb"}))
app.use(cors());


//Routes setup
app.use("/api/status", (req,res)=>res.send("Server is Live"));
app.use("/api/auth",userRouter);


//Connect to MONGODB
await connectDB();



const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>console.log("Server is running on PORT: "+PORT));