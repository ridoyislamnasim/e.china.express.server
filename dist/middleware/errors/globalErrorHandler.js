"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorParser_1 = require("../../utils/errorParser");
const globalErrorHandler = (err, req, res, next) => {
    const code = err.statusCode ? err.statusCode : 500;
    const message = err.message;
    console.error('Global Error Handler:', err); // Log the error for debugging
    // console.error('Global Error Handler:', err.statusCode); // Log the error for debugging
    //   console.error('Global Error Handler:', err.message); // Log the error for debugging
    if (err.status == undefined) {
        const parsedError = (0, errorParser_1.parsePostgreSQLError)(err);
        console.error('Parsed Error:', parsedError); // Log the parsed error for debugging
        return res.status(code).json({
            statusCode: code,
            status: parsedError.status,
            message: parsedError.message,
            errors: parsedError.errors || {},
        });
    }
    else {
        res.status(code).json({
            statusCode: code,
            status: 'error',
            message,
        });
    }
    // res.status(code).json({err, message });
};
exports.default = globalErrorHandler;
