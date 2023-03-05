import { Course } from "../models/Course.js";
import { Lesson } from "../models/Lesson.js";
import { User } from "../models/User.js";

export const getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find();
        return res.json(allCourses)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ messsage: 'Произошла непредвиденная ошибка' })
    }
};

export const createCourse = async (req, res) => {
    try {
        const course = new Course({
            name: req.body.name,
            imageLink: req.body.imageLink,
            author: req.body.author,
            description: req.body.description,
        });
      
        const user = await User.findById(req.body.author);
        user.courses.push(course._id)
      
        user.save()
        course.save();

        return res.json({ messsage: 'Курс успешно создан' })
    } catch (error) {
        return res.status(500).json({ messsage: 'Произошла непредвиденная ошибка' })
    }

};

export const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if(!course) {
            return res.status(404).json({ message: 'Курс не найден' });
        }
        const lessons = await Lesson.find({ course: req.params.id })
        course.lessons = lessons;
        
        return res.json({ ...course._doc, lessons })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Что-то пошло не так', error})
    }
  
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if(!course) {
        return res.status(404).json({ message: 'Курс не найден' });
    }

    course.name = req.body.name;
    course.description = req.body.description;
    course.imageLink = req.body.imageLink;

    if (req.body?.students?.length) {
      req.body.students.forEach(async student => {
        const user = await User.findOne({ username: student });
        user.courses.push(req.params.id)
        user.save()
      });
    }

    course.save();

    return res.json({ message: 'Курс успещно обновлен', ...course})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Произошла непредвиденная ошибка' });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if(!course) {
        return res.status(404).json({ message: 'Курс не найден' });
    }

    course.remove();

    res.json({ message: 'Курс успешно удален' })
  } catch (error) {
    
  }
};
