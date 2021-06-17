import { UserModel } from '../models/User';
import { generateToken } from '../../utils/generateToken';
import { formatBrazilDate } from '../../utils/formatDate';

import bcrypt from 'bcryptjs';
import * as Yup from 'yup';
import { Request, Response } from 'express';

export default {
  async createSession(request: Request, response: Response): Promise<Response> {
    const validationFields: Yup.AnyObjectSchema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await validationFields.isValid(request.body))) {
      // Verifica se passou pelo schema
      return response.status(400).json({ error: 'Email ou senha inválidos' });
    }

    const { email, password } = request.body;

    const user = await UserModel.findOne({ email }).select('+password');

    await UserModel.findOneAndUpdate({
      email,
      last_login: formatBrazilDate(),
    });

    if (!user) {
      return response.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return response.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Hide password
    user.password = undefined;

    response.status(200).json({
      user,
      token: `Bearer ${generateToken({ id: user._id })}`,
    });
  },
};
