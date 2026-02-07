"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePostgreSQLError = parsePostgreSQLError;
const client_1 = require("@prisma/client");
function parsePostgreSQLError(error) {
    var _a, _b, _c, _d, _e;
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const errors = {};
        // Handle Prisma validation errors (e.g., unknown argument)
        if (error.message && error.message.includes('Unknown argument')) {
            // Try to extract the unknown argument and suggestion from the error message
            const match = error.message.match(/Unknown argument `(\w+)`. Did you mean `(\w+)`\?/);
            if (match) {
                const [, unknownArg, suggestion] = match;
                return {
                    status: 'error',
                    message: `Unknown argument '${unknownArg}'. Did you mean '${suggestion}'? Please check your Prisma schema and payload.`,
                };
            }
            // Fallback for other Prisma validation errors
            return {
                status: 'error',
                message: error.message,
            };
        }
        switch (error.code) {
            case 'P2002': // Unique constraint violation
                const fields = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target; // Get the fields causing the error
                const model = (_b = error.meta) === null || _b === void 0 ? void 0 : _b.model; // Get the model causing the error
                if (Array.isArray(fields)) {
                    fields.forEach((field) => {
                        errors[field] = `${field} in ${model || 'the database'} must be unique. This value already exists.`;
                    });
                }
                else if (typeof fields === 'string') {
                    errors[fields] = `${fields} in ${model || 'the database'} must be unique. This value already exists.`;
                }
                return {
                    status: 'error',
                    message: Array.isArray(fields)
                        ? fields.map((field) => `${field} in ${model || 'the database'} must be unique. This value already exists.`).join(', ')
                        : `${fields} in ${model || 'the database'} must be unique. This value already exists.`,
                    errors,
                };
            case 'P2025': // Record not found
                return {
                    status: 'error',
                    message: `The requested record was not found in ${((_c = error.meta) === null || _c === void 0 ? void 0 : _c.model) || 'the database'}.`,
                };
            case 'P2003': // Foreign key constraint violation
                return {
                    status: 'error',
                    message: `Foreign key constraint failed in ${((_d = error.meta) === null || _d === void 0 ? void 0 : _d.model) || 'the database'}. Please check related data.`,
                };
            case 'P2028': // Transaction start timeout
                return {
                    status: 'error',
                    message: `Transaction API error: Unable to start a transaction in the given time. This may indicate database overload, connection pool exhaustion, or network issues. Consider increasing transaction timeout, adding retries with backoff, or checking database availability. Original message: ${error.message}`,
                };
            default:
                return {
                    status: 'error',
                    message: `An unexpected error occurred in ${((_e = error.meta) === null || _e === void 0 ? void 0 : _e.model) || 'the database'}: ${error.message}`,
                };
        }
    }
    else if (error.message) {
        // Map common network/connection errors to more actionable messages
        const lowerMsg = error.message.toLowerCase();
        if (lowerMsg.includes('connection reset') || lowerMsg.includes('connectionreset') || lowerMsg.includes('ecorrupt') || lowerMsg.includes('econnreset')) {
            return {
                status: 'error',
                message: 'Database connection was reset. This often indicates transient network issues or the database process restarting. Please check database health and network connectivity.',
            };
        }
        return {
            status: 'error',
            message: error.message,
        };
    }
    // Default error response for unknown errors
    return {
        status: 'error',
        message: 'An unexpected error occurred',
    };
}
