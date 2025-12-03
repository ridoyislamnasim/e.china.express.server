"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchError_1 = __importDefault(require("../errors/catchError"));
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
const errorParser_1 = require("../../utils/errorParser");
const date_1 = require("../../utils/date");
// import { sleep } from '../../utils/sleep'; // Utility function for retry delays
const withTransaction = (handler) => {
    return (0, catchError_1.default)(async (req, res, next) => {
        const maxRetries = 3;
        const retryDelay = 1000; // 1 second
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await prismadatabase_1.default.$transaction(async (tx) => {
                    await handler(req, res, next, tx);
                }, { timeout: 10000 }); // 10-second timeout
                return; // Exit loop if successful
            }
            catch (error) {
                console.error(`Transaction attempt ${attempt} failed:`, error);
                if (attempt < maxRetries) {
                    console.warn(`Transaction attempt ${attempt} failed. Retrying in ${retryDelay}ms...`);
                    await (0, date_1.sleep)(retryDelay);
                }
                else {
                    const parsedError = (0, errorParser_1.parsePostgreSQLError)(error);
                    next(parsedError);
                }
            }
        }
    });
};
exports.default = withTransaction;
