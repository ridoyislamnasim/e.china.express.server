import jwt from 'jsonwebtoken';
import config from '../config/config';

export function generateAccessToken(payload: object): string {
  // console.log('Generating access token with payload:', config);
  // console.log('Generating access token with payload:', config.jwtAccessSecretKey);
  if (!config.jwtAccessSecretKey) {
    throw new Error('JWT access secret key is not defined');
  }
  return jwt.sign(payload, config.jwtAccessSecretKey, { expiresIn: '30d' });
}

export function generateRefreshToken(payload: object): string {
  if (!config.jwtRefreshSecretKey) {
    throw new Error('JWT refresh secret key is not defined');
  }
  return jwt.sign(payload, config.jwtRefreshSecretKey, { expiresIn: '365d' });
}

export function verifyAccessToken(token: string): Promise<object | string> {
  return new Promise((resolve, reject) => {
    if (!config.jwtAccessSecretKey) {
      return reject(new Error('JWT access secret key is not defined'));
    }
    jwt.verify(token, config.jwtAccessSecretKey, (err, payload) => {
      if (err) return reject(err);
      resolve(payload!);
    });
  });
}

export function verifyRefreshToken(token: string): Promise<object | string> {
  return new Promise((resolve, reject) => {
    if (!config.jwtRefreshSecretKey) {
      return reject(new Error('JWT refresh secret key is not defined'));
    }
    jwt.verify(token, config.jwtRefreshSecretKey, (err, payload) => {
      if (err) return reject(err);
      resolve(payload!);
    });
  });
}
