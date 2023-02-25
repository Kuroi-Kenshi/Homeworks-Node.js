import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt'

import { Role } from './Role.js';

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, required: false },
  roles: [{ type: String, ref: 'Role' }],
  courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
});

export const User = model('User', UserSchema);

const users = await User.find();

if (!users.length) {
  //создаем админа
  const userRole = await Role.findOne({ value: 'ADMIN' })
  const saltRounds = 7;

  bcrypt.hash('admin', saltRounds, async (err, hash) => {
    const newUser = new User({ username: 'admin', password: hash, roles: [userRole.value] });
    await newUser.save();
  });
}