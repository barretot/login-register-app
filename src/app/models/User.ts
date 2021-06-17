import { Schema, model } from 'mongoose';
import { User } from './UserDTO';

import { v4 as uuid_v4 } from 'uuid';
import bcrypt from 'bcryptjs';

const schema = new Schema<User>({
  _id: { type: 'string', default: uuid_v4 },
  createdAt: { type: Date, default: Date.now(), select: false },

  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  phones: [
    {
      ddd: { type: Number },
      number: { type: Number },
    },
  ],
});

schema.pre('save', async function (next) {
  this.updateAt = Date.now();

  const hash = await bcrypt.hash(this.password, 8);
  this.password = hash;

  next();
});

const UserModel = model<User>('User', schema);

export { UserModel };
