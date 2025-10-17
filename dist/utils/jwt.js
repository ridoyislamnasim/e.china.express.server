"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
function generateAccessToken(payload) {
    // console.log('Generating access token with payload:', config);
    // console.log('Generating access token with payload:', config.jwtAccessSecretKey);
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
