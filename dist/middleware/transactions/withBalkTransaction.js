"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchError_1 = __importDefault(require("../errors/catchError"));
const prismadatabase_1 = __importDefault(require("../../config/prismadatabase"));
const client_1 = require("@prisma/client");
const errorParser_1 = require("../../utils/errorParser");
const date_1 = require("../../utils/date");
const withBalkTransaction = (handler) => {
    return (0, catchError_1.default)(async (req, res, next) => {
        const maxRetries = 3;
        const retryDelay = 1000;
        const transactionTimeout = 60000;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await prismadatabase_1.default.$transaction(async (tx) => {
                    await handler(req, res, next, tx);
                }, {
                    timeout: transactionTimeout
                });
                return;
            }
            catch (error) {
                console.error(`Transaction attempt ${attempt} failed:`, error);
                if (attempt < maxRetries) {
                    console.warn(`Transaction attempt ${attempt} failed. Retrying in ${retryDelay}ms...`);
                    await (0, date_1.sleep)(retryDelay);
                }
                else {
                    const parsedError = (0, errorParser_1.parsePostgreSQLError)(error);
                    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                        if (error.code === 'P2028') {
                        }
                    }
                    next(parsedError);
                    return;
                }
            }
        }
    });
};
exports.default = withBalkTransaction;
