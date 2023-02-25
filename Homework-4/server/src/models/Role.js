import { Schema, model } from 'mongoose';

const RoleSchema = new Schema({
  value: { type: String, unique: true, required: true, default: 'USER' },
});

export const Role = model('Role', RoleSchema);