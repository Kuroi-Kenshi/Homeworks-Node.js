import { Schema, model } from 'mongoose';

const CourseSchema = new Schema({
  name: { type: String, unique: true, required: true },
  description: { type: String },
  imageLink: { type: String },
  author: { type: String, required: true }
});

CourseSchema.pre('remove', async function (next) {
  await this.model('Lesson').deleteMany({ course: this._id });
  const usersWithCourse = await this.model('User').find({ courses: { "$in" : [this._id]} });

  usersWithCourse.forEach(user => {
    const newCourses = user.courses.filter(courseId => (
      courseId.toString() !== this._id.toString()
    ));

    user.courses = newCourses;
    user.save()
  });

  next()
});

export const Course = model('Course', CourseSchema);
