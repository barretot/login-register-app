import jwt from 'jsonwebtoken';
import authConfig from '../config/authConfig';

export function generateToken(params: {}): string {
  const secret: string = authConfig.secret;
  const expiresIn: string | number = authConfig.expiresIn;
  return jwt.sign(params, secret, {
    expiresIn,
  });
}
