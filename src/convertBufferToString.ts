import { Iconv } from 'iconv';


export function convertBufferToString(buffer: Buffer, encoding?: string): string {
  // if no encoding is passed in, default to utf-8 (as recommended by Apple)
  if (!encoding) {
    encoding = 'UTF-16';
  }
  // convert buffer to utf-8 string and return
  const iconv = new Iconv(encoding, 'UTF-8');
  return iconv.convert(buffer).toString('utf8');
}
