"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 102400000,
    },
    fileFilter: (req, file, cb) => {
        var _a;
        // console.log('file', file);
        // Check if the file type is allowed
        if (file.mimetype === 'image/png' ||
            file.mimetype === 'image/webp' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'application/pdf' ||
            file.mimetype === 'image/svg+xml' ||
            file.mimetype === 'image/svg' ||
            file.mimetype === 'image/gif' ||
            file.mimetype === 'image/avif' ||
            file.mimetype === 'image/bmp' ||
            ((_a = file.mimetype) === null || _a === void 0 ? void 0 : _a.includes('video'))) {
            cb(null, true);
        }
        else {
            cb(new Error('only .jpg, .png, .jpeg or .webp format allowed'), false);
        }
    },
});
