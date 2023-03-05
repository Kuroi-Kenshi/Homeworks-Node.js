import jwt from 'jsonwebtoken'
import { Course } from '../models/Course.js';
import { Lesson } from '../models/Lesson.js';
import { User } from '../models/User.js';

export const accessMiddleware = async (req, res, next) => {
  if (req.method === 'OPTIONS') next();
  try {
    const { refreshToken } = req.cookies
    const userData = jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN)
    if (!userData) {
      return res.status(400).json({ message: 'Пользователь не авторизован' })
    }

    const user = await User.findById(userData.id)
    const lesson = await Lesson.findById(req.params.id);
    const course = await Course.findById(lesson.course);

    if (!user.courses.includes(course._id) && !user.roles.includes('ADMIN')) {
      return res.status(403).json({ message: 'Нет доступа' })
    }

    next()
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Произошла непредвиденная ошибка' })
  }
}