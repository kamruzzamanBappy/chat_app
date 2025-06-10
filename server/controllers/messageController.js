
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";
//GET all users except the logged in user


export const getUsersForSidebar = async(req,res)=>{
    try {
   const userId = req.user._id;

   const filteredUsers = await User.find({_id:{$ne:userId}}).select("-password");


   //Count number of messages not seen
const unseenMessages = {}
const promises = filteredUsers.map(async(user)=>{
    const messages = await Message.find({senderId:user._id, receiverId:userId, seen:false})

if(messages.length > 0){
    unseenMessages[user._id] = messages.length; //number of message
 
}})

    await Promise.all(promises);
    res.json({success:true, users:filteredUsers, unseenMessages})}

   catch(error) {
    console.log(error.message);
    res.json({success:false, message:filteredUsers, unseenMessages})
}
}

//GET ALL MESSAGES FOR SELECTED USER

export const getMessages = async(req,res) =>{
    try {
     const {id:selectedUserId} = req.params;
     const myId = req.user._id;
     
     const messages = await Message.find({
        $or:[
            {senderId:myId, receiverId:selectedUserId},
                {senderId:selectedUserId, receiverId:myId},
        ]
     })

     await Message.updateMany({senderId:selectedUserId, receiverId:myId}, {seen:true});

  res.json({success:true, messages})   



    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}


//api to mark message as seen using message id

export const markMessageAsSeen = async(req,res)=>{
try {
        const {id} = req.params;
        await Message.findByIdAndUpdate(id,{seen:true})
        res.json({success:true})
} catch(error){
    console.log(error.message)
    res.json({success:false, message:error.message})
}


}


//send message to selected user
export const sendMessage = async (req,res)=>{
    try {
const {text,image} = req.body;
const receiverId = req.params.id;
const senderId = req.user._id;


// if we have image upload the image on cloudinary
let imageUrl;
if(image) {
const uploadResponse = await cloudinary.uploader.upload(image);

//after upload image we get image url,we store in image url variable
imageUrl = uploadResponse.secure_url;
}

//store the message data in database for that use message model

const newMessage = await Message.create({
    //we add data
    senderId,
    receiverId,
    text,
    image: imageUrl
})
//Emit the new message to the receiver sockets
const receiverSocketId = userSocketMap[receiverId];

if(receiverSocketId){
    io.to(receiverSocketId).emit("newMessage",newMessage)
}



res.json({success:true, newMessage});
  
} catch(error){
console.log(error.message)
res.json({success:false, message:error.message})
    }
}

     
