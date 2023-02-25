import { Schema, model } from 'mongoose';

const CommentSchema = new Schema({
  author: { 
    id: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String }
  },
  text: { type: String }
})

const LessonSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  videoLink: { type: String },
  comments: [CommentSchema],
  duration: { type: Number },
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
});

export const Lesson = model('Lesson', LessonSchema);