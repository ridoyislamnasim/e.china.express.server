
import { convertFileNameWithPdfExt } from './imageUplodHelper/convertFileNameWithPdfExt';
import { convertFileNameWithWebpExt } from './imageUplodHelper/convertFileNameWithWebpExt';
import { convertImgArrayToObject } from './imageUplodHelper/convertImgArrayToObject';
import { uploadToR2 } from './imageUplodHelper/uploadToR2';
import { isMainThread } from 'worker_threads';
import sharp from 'sharp';

export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  fieldname: string;
  mimetype: string;
}

const ImgUploader = async (files: UploadedFile[]): Promise<any> => {
  let image;
  if (Array.isArray(files) && files.length > 0 && isMainThread) {
    const imgFile: UploadedFile[] = [];
    for (const { buffer, originalname, fieldname, mimetype } of files) {
      let uploadBuffer = buffer;
      let uploadName = originalname;
      let uploadMime = mimetype;
      // Any image type (jpg, png, gif, etc.) will be converted to webp before upload
      if (mimetype.startsWith('image/')) {
        // Convert any image to webp using sharp
        uploadBuffer = await sharp(buffer).webp().toBuffer();
        // Generate a unique webp filename
        uploadName = convertFileNameWithWebpExt(originalname).replace(/\.[^.]+$/, '.webp');
        uploadMime = 'image/webp';
      } else if (mimetype === 'application/pdf') {
        uploadName = convertFileNameWithPdfExt(originalname);
      }
      const fileObj = { buffer: uploadBuffer, originalname: uploadName, fieldname, mimetype: uploadMime };
      imgFile.push(fileObj);
      try {
        // console.log('Uploading file img uploader:', fileObj);
        const data = await uploadToR2(fileObj);
        // console.log('File uploaded successfully ---upload:', data);
      } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('File upload failed');
      }
    }
    image = convertImgArrayToObject(imgFile);
  } else {
    throw new Error('Invalid or empty files array');
  }
  return image;
};

export default ImgUploader;
