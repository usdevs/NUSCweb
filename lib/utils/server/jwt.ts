import { default as jwt } from 'jsonwebtoken';

const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY?.replace(/\\n/g, '\n');
const PUBLIC_KEY = process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, '\n');

if (!PRIVATE_KEY) {
  throw new Error('No loaded private key - ensure JWT_PRIVATE_KEY is set');
}

if (!PUBLIC_KEY) {
  throw new Error('No loaded public key - ensure JWT_PUBLIC_KEY is set');
}

export const generateToken = (payload: string | Buffer | object): string =>
  jwt.sign(payload, PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: '24h',
  });

export const validateCookie = (token: string) =>
  jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'], complete: true });
