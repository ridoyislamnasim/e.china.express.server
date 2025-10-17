"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const convertFileNameWithPdfExt_1 = require("./imageUplodHelper/convertFileNameWithPdfExt");
const convertFileNameWithWebpExt_1 = require("./imageUplodHelper/convertFileNameWithWebpExt");
const convertImgArrayToObject_1 = require("./imageUplodHelper/convertImgArrayToObject");
const uploadToR2_1 = require("./imageUplodHelper/uploadToR2");
const worker_threads_1 = require("worker_threads");
const sharp_1 = __importDefault(require("sharp"));
const ImgUploader = async (files) => {
    let image;
    if (Array.isArray(files) && files.length > 0 && worker_threads_1.isMainThread) {
        const imgFile = [];
        for (const { buffer, originalname, fieldname, mimetype } of files) {
            let uploadBuffer = buffer;
            let uploadName = originalname;
            let uploadMime = mimetype;
            // Any image type (jpg, png, gif, etc.) will be converted to webp before upload
            if (mimetype.startsWith('image/')) {
                // Convert any image to webp using sharp
                uploadBuffer = await (0, sharp_1.default)(buffer).webp().toBuffer();
                // Generate a unique webp filename
                uploadName = (0, convertFileNameWithWebpExt_1.convertFileNameWithWebpExt)(originalname).replace(/\.[^.]+$/, '.webp');
                uploadMime = 'image/webp';
            }
            else if (mimetype === 'application/pdf') {
                uploadName = (0, convertFileNameWithPdfExt_1.convertFileNameWithPdfExt)(originalname);
            }
            const fileObj = { buffer: uploadBuffer, originalname: uploadName, fieldname, mimetype: uploadMime };
            imgFile.push(fileObj);
            try {
                // console.log('Uploading file img uploader:', fileObj);
                const data = await (0, uploadToR2_1.uploadToR2)(fileObj);
                // console.log('File uploaded successfully ---upload:', data);
            }
            catch (error) {
                console.error('Error uploading file:', error);
                throw new Error('File upload failed');
            }
        }
        image = (0, convertImgArrayToObject_1.convertImgArrayToObject)(imgFile);
    }
    else {
        throw new Error('Invalid or empty files array');
    }
    return image;
};
exports.default = ImgUploader;
