
// import jwt, { type JwtPayload, type VerifyErrors } from 'jsonwebtoken';
// import config from '../config/config';

// export function generateAccessToken(payload: object): string {
//   if (!config.jwtAccessSecretKey) {
//     throw new Error('JWT access secret key is not defined');
//   }
//   return jwt.sign(payload, config.jwtAccessSecretKey, { expiresIn: '30d' });
// }

// export function generateRefreshToken(payload: object): string {
//   if (!config.jwtRefreshSecretKey) {
//     throw new Error('JWT refresh secret key is not defined');
//   }
//   return jwt.sign(payload, config.jwtRefreshSecretKey, { expiresIn: '365d' });
// }

// export function verifyAccessToken(token: string): Promise<JwtPayload | string> {
//   return new Promise((resolve, reject) => {
//     if (!config.jwtAccessSecretKey) {
//       return reject(new Error('JWT access secret key is not defined'));
//     }

//     jwt.verify(
//       token,
//       config.jwtAccessSecretKey,
//       (err: VerifyErrors | null, payload: JwtPayload | string | undefined) => {
//         if (err) return reject(err);
//         resolve(payload!);
//       }
//     );
//   });
// }

// export function verifyRefreshToken(token: string): Promise<JwtPayload | string> {
//   return new Promise((resolve, reject) => {
//     if (!config.jwtRefreshSecretKey) {
//       return reject(new Error('JWT refresh secret key is not defined'));
//     }

//     jwt.verify(
//       token,
//       config.jwtRefreshSecretKey,
//       (err: VerifyErrors | null, payload: JwtPayload | string | undefined) => {
//         if (err) return reject(err);
//         resolve(payload!);
//       }
//     );
//   });
// }





import jwt from "jsonwebtoken";
import config from "../config/config";

// Manual Type Fix (Because library no longer exports them)
interface CustomJwtPayload {
  id?: string | number;
  email?: string;
  [key: string]: any;
}

type JwtVerifyError = Error | null;

// Generate Access Token
export function generateAccessToken(payload: object): string {
  if (!config.jwtAccessSecretKey) throw new Error("JWT access secret key missing");
  return jwt.sign(payload, config.jwtAccessSecretKey, { expiresIn: "30d" });
}

// Generate Refresh Token
export function generateRefreshToken(payload: object): string {
  if (!config.jwtRefreshSecretKey) throw new Error("JWT refresh secret key missing");
  return jwt.sign(payload, config.jwtRefreshSecretKey, { expiresIn: "365d" });
}

// Verify Access Token
export function verifyAccessToken(token: string): Promise<CustomJwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtAccessSecretKey!, (err: JwtVerifyError, decoded: any) => {
      if (err || !decoded) return reject(err);
      resolve(decoded as CustomJwtPayload);
    });
  });
}

// Verify Refresh Token
export function verifyRefreshToken(token: string): Promise<CustomJwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtRefreshSecretKey!, (err: JwtVerifyError, decoded: any) => {
      if (err || !decoded) return reject(err);
      resolve(decoded as CustomJwtPayload);
    });
  });
}
