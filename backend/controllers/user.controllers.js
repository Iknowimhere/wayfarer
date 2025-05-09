import asyncHandler from "express-async-handler";
import userInstance from "../services/user.services.js";

export const getUsers=asyncHandler(async (req,res,next)=>{
    const users=await userInstance.findAllUsers()
    if(!users){
        let err=new Error("Users not found")
        err.statusCode=404
        throw err;
    }
    res.status(200).json(users)
})

export const updateUser=asyncHandler(async (req,res,next)=>{
    res.status(200).json({
        message:"User updated successfully"
    })
})