"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.NotFoundError = exports.UnauthorizedError = exports.BadRequestError = exports.GeneralError = void 0;
class GeneralError extends Error {
    constructor(message) {
        super(message);
        this.name = 'GeneralError';
        this.statusCode = 500;
    }
}
exports.GeneralError = GeneralError;
class BadRequestError extends GeneralError {
    constructor(message) {
        super(message);
        this.name = 'BadRequestError';
        this.statusCode = 400;
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends GeneralError {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 401;
    }
}
exports.UnauthorizedError = UnauthorizedError;
class NotFoundError extends GeneralError {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends GeneralError {
    constructor(message) {
        super(message);
        this.name = 'ConflictError';
        this.statusCode = 409;
    }
}
exports.ConflictError = ConflictError;
