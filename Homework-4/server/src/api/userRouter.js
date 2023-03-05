import express from 'express'; 
import { getUser } from '../controllers/userController.js';
import { accessMiddleware } from '../middleware/accessMiddleware.js';
export const userRouter = express.Router();

userRouter.get('/', getUser);