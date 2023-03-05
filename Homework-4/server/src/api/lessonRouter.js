import express from 'express';
import { check } from 'express-validator'
import { createLesson, getLesson, updateLesson, addComment, deleteLesson } from '../controllers/lessonController.js';
import { accessMiddleware } from '../middleware/accessMiddleware.js';
export const lessonRouter = express.Router();


const validation = () => ([
  check('name', "Имя не может быть пустым").notEmpty(),
])

lessonRouter.post('/', validation(), createLesson);
lessonRouter.patch('/:id', validation(), updateLesson);
lessonRouter.get('/:id', accessMiddleware, getLesson);
lessonRouter.delete('/:id', accessMiddleware, deleteLesson);
lessonRouter.patch('/:id/addComment', accessMiddleware, addComment);