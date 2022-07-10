import { Iconv } from 'iconv';


export function convertStringToBuffer(str: string, encoding?: string): Buffer {
  // if no encoding is passed in, default to utf-8 (as recommended by Apple)
  if (!encoding) {
    encoding = 'UTF-16';
  }
  const iconv = new Iconv('UTF-8', encoding);
  return iconv.convert(str);
}
