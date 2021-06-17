import jwt from 'jsonwebtoken';
import authConfig from '../config/authConfig';

export function generateToken(params: {}): string {
  const secret: string = authConfig.secret;
  return jwt.sign(params, secret, {
    expiresIn: 1800,
  });
}
