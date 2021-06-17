import { Schema, model } from 'mongoose';
import { User } from './UserDTO';
import { formatBrazilDate } from '../../utils/formatDate';

import { v4 as uuid_v4 } from 'uuid';
import bcrypt from 'bcryptjs';

const schema = new Schema<User>({
  _id: { type: 'string', default: uuid_v4 },
  created_at: { type: String, default: formatBrazilDate(), select: false },
  last_login: { type: String, default: formatBrazilDate() },

  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  phones: [
    {
      _id: { type: 'string', default: uuid_v4 },
      ddd: { type: Number },
      number: { type: Number },
    },
  ],
});

schema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 8);
  this.password = hash;

  next();
});

const UserModel = model<User>('User', schema);

export { UserModel };
