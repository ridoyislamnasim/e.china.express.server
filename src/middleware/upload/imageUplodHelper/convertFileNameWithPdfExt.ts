import path from 'path';
import shortid from 'shortid';

export function convertFileNameWithPdfExt(fileOriginalName: string): string {
  const fileExt = path.extname(fileOriginalName);
  const fileName = `${fileOriginalName
    .replace(fileExt, '')
    .toLowerCase()
    .split(' ')
    .join('-')}-${shortid.generate()}.pdf`;
  return fileName;
}
