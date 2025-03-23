import jwt from 'jsonwebtoken';
import { config } from './config';

interface TokenPayload {
  id: string;
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId } as TokenPayload, config.jwtSecret as jwt.Secret, {
    expiresIn: '24h',
  });
};

export const verifyToken = (token: string): string => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret as jwt.Secret) as TokenPayload;
    return decoded.id;
  } catch (error) {
    throw new Error('Invalid token');
  }
}; 