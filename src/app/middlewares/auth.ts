import jwt from 'jsonwebtoken';
import authConfig from '../../config/authConfig';
import { Request, Response } from 'express';

export default async function (
  request: Request,
  response: Response,
  next,
): Promise<Response> {
  const authHeader: string = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: 'Token not provided' });
  }

  const parts: string[] = authHeader.split(' ');

  if (!parts.length === 2) {
    return response.status(4001).json({ error: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return response.status(400).json({ error: 'Token malformatted ' });
  }

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) return response.status(401).json({ error: 'Token invalid' });

    request.userId = decoded.id;

    return next();
  });
}
