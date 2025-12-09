// src/types/express.d.ts
import * as Express from 'express';
// Multer এর টাইপস ইম্পোর্ট করা হচ্ছে
import { File } from 'multer'; 

declare global {
  namespace Express {
    interface Request {
      // 'files' প্রপার্টিটি এখানে যোগ করা হচ্ছে
      files?: { [fieldname: string]: File[] } | File[]; 
      file?: File; // যদি আপনি single ফাইল আপলোডও ব্যবহার করেন
    }
  }
}

// Multer-এর নিজস্ব ডিক্লারেশন ফাইলটি নিশ্চিত করুন 
// যাতে File টাইপটি সঠিকভাবে সংজ্ঞায়িত হয়।
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