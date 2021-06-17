import authConfig from '../../config/authConfig';

import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { promisify } from 'util';

export default async function (
  request: Request,
  response: Response,
  next,
): Promise<Response> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: 'Token não fornecido' });
  }

  if (Date.now() >= authConfig.expiresIn) {
    return response.status(401).json({ error: 'Sessão inválida' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    request.userId = decoded.id;

    return next();
  } catch (err) {
    return response.status(401).json({ error: 'Não autorizado' });
  }
}
