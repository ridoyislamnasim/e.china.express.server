"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchError_1 = __importDefault(require("../errors/catchError"));
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
const errorParser_1 = require("../../utils/errorParser");
// import { sleep } from '../../utils/sleep'; // Utility function for retry delays
const withTransaction = (handler) => {
    return (0, catchError_1.default)(async (req, res, next) => {
        const timeout = parseInt(process.env.TRANSACTION_TIMEOUT_MS || '10000', 10); // transaction timeout
        try {
            await prismadatabase_1.default.$transaction(async (tx) => {
                await handler(req, res, next, tx);
            }, { timeout });
            return;
        }
        catch (error) {
            console.error(`Transaction failed:`, error);
            const parsedError = (0, errorParser_1.parsePostgreSQLError)(error);
            next(parsedError);
        }
    });
};
exports.default = withTransaction;
