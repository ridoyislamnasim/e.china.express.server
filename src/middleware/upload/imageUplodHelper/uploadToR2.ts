import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export interface UploadFile {
  buffer: Buffer;
  originalname: string;
  fieldname: string;
  mimetype: string;
}

// Token value = lMxXofw3NAHfcqyFEVZNRLxh8jdwVFfpS4-u3_Wh
// Access Key ID = 1529236438b5f40b5f07794d5e2a9a6f
// Secret Access Key = 88b9aa54bd46f445e8a53caebf0f9f95598072c2a1794c1999435d3a40ee1c8c
// Default = https://88d3d3ccdb24244e9931333d3688cb90.r2.cloudflarestorage.com
// Name: nasimwebimage
const R2_ACCESS_KEY_ID = '1529236438b5f40b5f07794d5e2a9a6f';
const R2_SECRET_ACCESS_KEY = '88b9aa54bd46f445e8a53caebf0f9f95598072c2a1794c1999435d3a40ee1c8c';
const R2_ENDPOINT = 'https://88d3d3ccdb24244e9931333d3688cb90.r2.cloudflarestorage.com'; // Replace with your actual R2 endpoint
const R2_BUCKET = 'nasimwebimage'; // Replace with your actual bucket name

export async function uploadToR2(file: UploadFile): Promise<{ success: boolean; key?: string; error?: string }> {
  try {
    if (!R2_BUCKET || !R2_ENDPOINT) {
      throw new Error('R2 bucket or endpoint not configured');
    }
    const s3 = new S3Client({
      region: 'auto',
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
    const key = `${file.fieldname}/${file.originalname}`;
    const data = await s3.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));
    // console.log('File uploaded successfully:', data);
    return { success: true, key };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
