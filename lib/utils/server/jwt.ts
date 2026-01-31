import { default as jwt } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const SECRET_KEY = process.env.SECRET_KEY || uuidv4();

export const generateToken = (payload: string | Buffer | object): string =>
  jwt.sign(payload, SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: '24h',
  });

export const validateCookie = (token: string) =>
  jwt.verify(token, SECRET_KEY, { complete: true });
