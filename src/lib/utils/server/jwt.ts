import { default as jwt } from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'secret';

export const generateToken = (payload: string | Buffer | object): string =>
  jwt.sign(payload, SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: '24h',
  });

export const validateCookie = (token: string) =>
  jwt.verify(token, SECRET_KEY, { complete: true });
