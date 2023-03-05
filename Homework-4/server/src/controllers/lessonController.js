import { Lesson } from "../models/Lesson.js";
import { User } from "../models/User.js";

export const createLesson = (req, res) => {
  try {
    const lesson = new Lesson({
      name: req.body.name,
      description: req.body.description,
      videoLink: req.body.videoLink,
      duration: req.body.duration,
      course: req.body.course,
  });

  lesson.save();
    return res.json({ message: 'Урок успешно добавлен', ...lesson })
  } catch (error) {
    return res.status(500).json({ message: 'ПРоизошла непредвиденная ошибка'})
  }

};

export const getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if(!lesson) {
      return res.status(404).json({ error: 'Урок не найден' });
    }

    return res.json({ ...lesson._doc })
  } catch (error) {
    return res.status(500).json({ message: 'ПРоизошла непредвиденная ошибка'})
  }

};

export const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if(!lesson) {
        return res.status(404).json({ message: 'Урок не найден' });
    }

    lesson.name = req.body.name;
    lesson.description = req.body.description;
    lesson.videoLink = req.body.videoLink;

    lesson.save();

    const { _id, _v, ...responseData } = lesson;

    return res.json({ message: 'Урок успешно обновлен', ...responseData })
  } catch (error) {
    res.status(500).json({ message: 'ПРоизошла непредвиденная ошибка'})
  }
};

export const addComment = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if(!lesson) {
      return res.status(404).json({ message: 'Урок не найден' });
    }
    const user = await User.findById(req.body.comment.author);

    const newComment = {
      author: {
        id: req.body.comment.author,
        name: user.username
      },
      text: req.body.comment.text
    }

    lesson.comments = [newComment, ...lesson.comments];
    lesson.save();

    res.json({ message: 'Комментарий успешно сохранен', comments: lesson.comments })
  } catch (error) {
    
  }
};

export const deleteLesson = async (req, res) => {
  try {
    await Lesson.deleteOne({ id: req.params.id });

    res.json({ message: 'Урок успешно удален' })
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ message: 'Произошла непредвиденная ошибка' })
  }
};
