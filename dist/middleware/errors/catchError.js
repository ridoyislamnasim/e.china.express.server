"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorParser_1 = require("../../utils/errorParser");
const catchError = (controller) => {
    return async (req, res, next) => {
        try {
            await controller(req, res, next);
        }
        catch (err) {
            // console.log("Error while ", err);
            // next(err);
            // console.error("Error caught in catchError middleware:", err);
            const parsedError = (0, errorParser_1.parsePostgreSQLError)(err);
            next(parsedError);
        }
    };
};
exports.default = catchError;
