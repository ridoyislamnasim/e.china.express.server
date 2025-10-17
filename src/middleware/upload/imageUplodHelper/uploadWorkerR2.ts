// import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
// import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
// import config from '../../../config/config';

// export interface UploadFile {
//   buffer: Buffer;
//   originalname: string;
//   fieldname: string;
//   mimetype: string;
// }

// // Function to handle single image upload to Cloudflare R2
// const uploadSingleImgR2 = async (file: UploadFile) => {
//   try {
//     if (!config.r2Bucket || typeof config.r2Bucket !== 'string') {
//       throw new Error('The R2 bucket is not defined or is not a valid string');
//     }
//     if (!file.originalname || typeof file.originalname !== 'string') {
//       throw new Error('The original filename is not defined or is not a valid string');
//     }
//     // Setup S3 client for Cloudflare R2
//     const s3 = new S3Client({
//       region: 'auto',
//       endpoint: config.r2Endpoint, // e.g. 'https://<accountid>.r2.cloudflarestorage.com'
//       credentials: {
//         accessKeyId: config.r2AccessKeyId,
//         secretAccessKey: config.r2SecretAccessKey,
//       },
//     });
//     const key = `${file.fieldname}/${file.originalname}`;
//     await s3.send(new PutObjectCommand({
//       Bucket: config.r2Bucket,
//       Key: key,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     }));
//     return { success: true, message: 'File uploaded to R2 successfully', key };
//   } catch (err: any) {
//     console.error('Error during R2 image upload:', err);
//     return { success: false, error: err.message || 'An error occurred' };
//   }
// };

// // Worker thread logic
// if (!isMainThread && parentPort) {
//   (async () => {
//     const result = await uploadSingleImgR2(workerData.file);
//     parentPort.postMessage(result);
//   })().catch(err => {
//     parentPort.postMessage({ success: false, error: err.message });
//   });
// }

// // Main thread function to create the worker and handle file upload
// export const uploadWorkerR2 = (file: UploadFile): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     const worker = new Worker(__filename, {
//       workerData: { file }
//     });
//     worker.on('message', (message) => {
//       resolve(message);
//     });
//     worker.on('error', (err) => {
//       reject(err);
//     });
//   });
// };
