"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFileNameWithWebpExt = convertFileNameWithWebpExt;
const path_1 = __importDefault(require("path"));
const shortid_1 = __importDefault(require("shortid"));
function convertFileNameWithWebpExt(fileOriginalName) {
    const fileExt = path_1.default.extname(fileOriginalName);
    const fileNameWithoutExt = fileOriginalName.replace(fileExt, '');
    const fileName = `${fileNameWithoutExt
        .toLowerCase()
        .split(' ')
        .join('-')}-${shortid_1.default.generate()}${fileExt}`;
    return fileName;
}
