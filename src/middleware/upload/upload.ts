import multer from 'multer';
import { Request } from 'express';

const storage = multer.memoryStorage();

const allowedMimes = [
  'image/png',
  'image/webp',
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/avif',
  'image/bmp',
  'image/svg+xml',
  'application/pdf',
  // video type allow
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/mpeg',
];

export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 100, // 100MB
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
    }
  },
});
