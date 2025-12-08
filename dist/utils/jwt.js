"use strict";
// import jwt from 'jsonwebtoken';
// import config from '../config/config';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
// export function generateAccessToken(payload: object): string {
//   // console.log('Generating access token with payload:', config);
//   // console.log('Generating access token with payload:', config.jwtAccessSecretKey);
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
// export function verifyAccessToken(token: string): Promise<object | string> {
//   return new Promise((resolve, reject) => {
//     if (!config.jwtAccessSecretKey) {
//       return reject(new Error('JWT access secret key is not defined'));
//     }
//     jwt.verify(token, config.jwtAccessSecretKey, (err, payload) => {
//       if (err) return reject(err);
//       resolve(payload!);
//     });
//   });
// }
// export function verifyRefreshToken(token: string): Promise<object | string> {
//   return new Promise((resolve, reject) => {
//     if (!config.jwtRefreshSecretKey) {
//       return reject(new Error('JWT refresh secret key is not defined'));
//     }
//     jwt.verify(token, config.jwtRefreshSecretKey, (err, payload) => {
//       if (err) return reject(err);
//       resolve(payload!);
//     });
//   });
// }
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
function generateAccessToken(payload) {
    if (!config_1.default.jwtAccessSecretKey) {
        throw new Error('JWT access secret key is not defined');
    }
    return jsonwebtoken_1.default.sign(payload, config_1.default.jwtAccessSecretKey, { expiresIn: '30d' });
}
function generateRefreshToken(payload) {
    if (!config_1.default.jwtRefreshSecretKey) {
        throw new Error('JWT refresh secret key is not defined');
    }
    return jsonwebtoken_1.default.sign(payload, config_1.default.jwtRefreshSecretKey, { expiresIn: '365d' });
}
function verifyAccessToken(token) {
    return new Promise((resolve, reject) => {
        if (!config_1.default.jwtAccessSecretKey) {
            return reject(new Error('JWT access secret key is not defined'));
        }
        jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecretKey, (err, payload) => {
            if (err)
                return reject(err);
            resolve(payload);
        });
    });
}
function verifyRefreshToken(token) {
    return new Promise((resolve, reject) => {
        if (!config_1.default.jwtRefreshSecretKey) {
            return reject(new Error('JWT refresh secret key is not defined'));
        }
        jsonwebtoken_1.default.verify(token, config_1.default.jwtRefreshSecretKey, (err, payload) => {
            if (err)
                return reject(err);
            resolve(payload);
        });
    });
}
