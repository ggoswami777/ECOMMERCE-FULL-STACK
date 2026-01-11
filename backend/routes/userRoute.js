import express from 'express';
import { adminLogin, loginUser, registeredUser } from '../controllers/userController.js';

const userRouter-express.Router();

userRouter.post('/register',registeredUser);
userRouter.post('/login',loginUser);
userRouter.post('/admin',adminLogin);
export default userRouter;

