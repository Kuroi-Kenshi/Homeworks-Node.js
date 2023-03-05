import express from 'express';
import { check } from 'express-validator'
import { createCourse, deleteCourse, getAllCourses, getCourse, updateCourse } from '../controllers/courseController.js';
export const courseRouter = express.Router();

const validation = () => ([
  check('name', "Имя не может быть пустым").notEmpty(),
])

courseRouter.post('/', validation(), createCourse);
courseRouter.patch('/:id', validation(), updateCourse);
courseRouter.get('/', getAllCourses);
courseRouter.delete('/:id', deleteCourse);
courseRouter.get('/:id', getCourse);