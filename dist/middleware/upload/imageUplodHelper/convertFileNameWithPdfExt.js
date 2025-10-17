"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFileNameWithPdfExt = convertFileNameWithPdfExt;
const path_1 = __importDefault(require("path"));
const shortid_1 = __importDefault(require("shortid"));
function convertFileNameWithPdfExt(fileOriginalName) {
    const fileExt = path_1.default.extname(fileOriginalName);
    const fileName = `${fileOriginalName
        .replace(fileExt, '')
        .toLowerCase()
        .split(' ')
        .join('-')}-${shortid_1.default.generate()}.pdf`;
    return fileName;
}
