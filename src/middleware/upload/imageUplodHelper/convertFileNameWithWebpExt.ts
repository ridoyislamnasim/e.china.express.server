import path from 'path';
import shortid from 'shortid';

export function convertFileNameWithWebpExt(fileOriginalName: string): string {
  const fileExt = path.extname(fileOriginalName);
  const fileNameWithoutExt = fileOriginalName.replace(fileExt, '');

  const fileName = `${fileNameWithoutExt
    .toLowerCase()
    .split(' ')
    .join('-')}-${shortid.generate()}${fileExt}`;
  return fileName;
}
