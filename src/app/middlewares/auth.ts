import authConfig from '../../config/authConfig';

import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { promisify } from 'util';

export default async function (request, response, next): Promise<Response> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: 'Token não fornecido' });
  }

  if (Date.now() >= Object(authConfig.expiresIn)) {
    return response.status(401).json({ error: 'Sessão inválida' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded: jwt.SigningKeyCallback = await promisify(jwt.verify)(
      token,
      authConfig.secret,
    );
    request.userId = decoded.id;

    return next();
  } catch (err) {
    return response.status(401).json({ error: 'Não autorizado' });
  }
}
