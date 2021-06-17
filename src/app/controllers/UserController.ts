import { UserModel } from '../models/User';
import { generateToken } from '../../utils/generateToken';

import * as Yup from 'yup';
import { Request, Response } from 'express';

export default {
  async create(request: Request, response: Response): Promise<Response> {
    const validationFields: Yup.AnyObjectSchema = Yup.object().shape({
      name: Yup.string().required().min(1),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      phones: Yup.array(),
    });

    const { name, email, password, phones } = request.body;

    if (!(await validationFields.isValid(request.body))) {
      // Verifica se passou pelo schema
      return response.status(401).json({ error: 'Invalid Fields' });
    }

    if (await UserModel.findOne({ email })) {
      return response.status(401).json({
        error: 'User already exists',
      });
    }

    const userCreate = await UserModel.create({
      name,
      email,
      password,
      phones,
    });

    // Hide password
    userCreate.password = undefined;

    return response.status(201).json({
      message: 'Sucess',
      userCreate,
      token: generateToken({ id: userCreate._id }),
    });
  },
};
