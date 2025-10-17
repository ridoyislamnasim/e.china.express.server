"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseHandler = responseHandler;
function responseHandler(statusCode, message, data) {
    return {
        statusCode,
        status: 'success',
        message,
        ...(data && { data }),
    };
}
