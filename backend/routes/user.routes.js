import express from 'express';
import { getUsers, updateUser } from '../controllers/user.controllers.js';
import auth from '../middlewares/auth.js';

let router=express.Router();


router.get("/",auth,getUsers)
router.get("/",auth,updateUser)


export default router;