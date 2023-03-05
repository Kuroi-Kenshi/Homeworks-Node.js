import express from 'express';
import { registration, login, refresh, getUsers, logout } from '../controllers/authController.js';
import { check } from 'express-validator'
export const authRouter = express.Router();

const validation = () => ([
  check('username', "Имя не может быть пустым").notEmpty(),
  check('password', "Пароль не может быть пустым").notEmpty(),
])

authRouter.post('/registration', validation(), registration);
authRouter.post('/login', validation(), login);
authRouter.post('/logout', logout);
authRouter.get('/refresh', refresh);
authRouter.get('/users', getUsers);