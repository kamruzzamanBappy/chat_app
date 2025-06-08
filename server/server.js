import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";

//Create Express app & Http server
const app = express();
const server = http.createServer(app)


//Middleware set up
app.use(express.json({limit: "4mb"}))
app.use(cors());

app.use("/api/status", (req,res)=>res.send("Server is Live"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>console.log("Server is running on PORT: "+PORT));