// src/types/express.d.ts
import 'express';
import { File } from 'multer';

declare global {
  namespace Express {
    interface Request {
      file: File | undefined;
      files: { [fieldname: string]: File[] } | File[] | undefined;
    }
  }
}

// যদি আপনি Multer এর পুরনো টাইপ ব্যবহার করে থাকেন
declare module 'multer' {
  interface File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
  }
}