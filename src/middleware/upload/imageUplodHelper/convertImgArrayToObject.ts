
// Set your Cloudflare R2 public base URL here
const R2_PUBLIC_BASE_URL = 'https://pub-186e997ba1b64f808ab6991e0130cdb4.r2.dev/';

export interface UploadedFile {
  fieldname: string;
  originalname: string;
}

export function convertImgArrayToObject(files: UploadedFile[]): Record<string, string | string[]> {
  return files.reduce((total: Record<string, string | string[]>, file: UploadedFile) => {
    // Use the full key (fieldname/originalname) to match the R2 object path
    const fileKey = `${file.fieldname}/${file.originalname}`;
    const fileUrl = `${R2_PUBLIC_BASE_URL}${fileKey}`;
    if (total[file.fieldname]) {
      if (Array.isArray(total[file.fieldname])) {
        (total[file.fieldname] as string[]).push(fileUrl);
      } else {
        total[file.fieldname] = [total[file.fieldname] as string, fileUrl];
      }
    } else {
      total[file.fieldname] = fileUrl;
    }
    return total;
  }, {});
}
