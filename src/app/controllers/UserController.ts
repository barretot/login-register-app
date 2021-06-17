import { UserModel } from '../models/User';
import { generateToken } from '../../utils/generateToken';

import * as Yup from 'yup';
import { Request, Response } from 'express';

export default {
  async index(request: Request, response: Response): Promise<Response> {
    const userIndex = await UserModel.find().select('+password');

    if (!userIndex.length) {
      return response.status(400).json({
        error: 'Usuários não encontrados, registre.',
      });
    }
    return response.status(200).json({ userIndex });
  },

  async search(request: Request, response: Response): Promise<Response> {
    const userSearch = await UserModel.findById(request.params.id).select(
      '+password',
    );

    if (!userSearch === null) {
      return response.status(400).json({ error: 'Usuário não encontrado' });
    }
    return response
      .status(200)
      .json({ message: 'Usuário encontrado', userSearch });
  },

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
      return response.status(400).json({ error: 'Campos inválidos' });
    }

    if (await UserModel.findOne({ email })) {
      return response.status(400).json({
        error: 'E-mail já existente',
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

    return response.status(200).json({
      message: 'Sucesso',
      userCreate,
      token: `Bearer ${generateToken({ id: userCreate._id })}`,
    });
  },

  async delete(request, response: Response): Promise<Response> {
    try {
      await UserModel.findOneAndDelete(request.params.id);
      return response.status(200).json({ Message: 'Deletado com sucesso!' });
    } catch (err) {
      response.status(400).json({
        error: err.message,
      });
    }
  },
};
