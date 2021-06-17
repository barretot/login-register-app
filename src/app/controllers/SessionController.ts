import { UserModel } from '../models/User';
import { generateToken } from '../../utils/generateToken';

import bcrypt from 'bcryptjs';
import * as Yup from 'yup';
import { Request, Response } from 'express';

export default {
  async createSession(request: Request, response: Response): Promise<Response> {
    const validationFields = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await validationFields.isValid(request.body))) {
      // Verifica se passou pelo schema
      return response.status(400).json({ error: 'Invalid Fields' });
    }

    const { email, password } = request.body;

    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      return response.status(400).json({ error: 'User not found' });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return response.status(400).json({ error: 'Invalid password' });
    }

    // Hide password
    user.password = undefined;

    response.status(200).json({
      user,
      token: generateToken({ id: user._id }),
    });
  },
};
