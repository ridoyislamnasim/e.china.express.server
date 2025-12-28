// import multer, { FileFilterCallback } from 'multer';
// import { Request } from 'express';

// const storage = multer.memoryStorage();

// export const upload = multer({
//   storage,
//   limits: {
//     fileSize: 102400000,
//   },
//   fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
//     // console.log('file', file);
//     // Check if the file type is allowed
//     if (
//       file.mimetype === 'image/png' ||
//       file.mimetype === 'image/webp' ||
//       file.mimetype === 'image/jpg' ||
//       file.mimetype === 'image/jpeg' ||
//       file.mimetype === 'application/pdf' ||
//       file.mimetype === 'image/svg+xml' ||
//       file.mimetype === 'image/svg' ||
//       file.mimetype === 'image/gif' ||
//       file.mimetype === 'image/avif' ||
//       file.mimetype === 'image/bmp' ||
//       file.mimetype?.includes('video')
//     ) {
//       cb(null, true);
//     } else {
//       cb(new Error('only .jpg, .png, .jpeg or .webp format allowed'));
//     }
//   },
// });
