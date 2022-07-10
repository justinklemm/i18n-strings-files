import fs from 'fs';
import { ReadWriteOption } from "./Option";
import { I18nStringsFiles } from './types';
import { compile } from './compile';
import { convertStringToBuffer } from './convertStringToBuffer';

type WriteFileCallback = (err: Error | null) => void;
type WriteFileOptionLike = ReadWriteOption | WriteFileCallback;

export function writeFile(file: string, data: I18nStringsFiles, options?: WriteFileOptionLike, callback?: WriteFileCallback) {
  let encoding: string | undefined;
  let wantsComments: boolean | undefined;
  if (typeof callback === 'undefined' && typeof options === 'function') {
    callback = options;
    encoding = undefined;
  } else if (typeof options === 'string') {
    encoding = options;
  } else if (typeof options === 'object') {
    encoding = options['encoding'];
    wantsComments = options['wantsComments'];
  }

  const str = compile(data, wantsComments);
  const buffer = convertStringToBuffer(str, encoding);
  fs.writeFile(file, buffer, (err) => {
    if (err && callback) {
      return callback(err);
    }
  });
}

export function writeFileSync(file: string, data: I18nStringsFiles, options?: WriteFileOptionLike) {
  let encoding: string | undefined;
  let wantsComments: boolean | undefined;
  if (typeof options === 'string') {
    encoding = options;
  } else if (typeof options === 'object') {
    encoding = options['encoding'];
    wantsComments = options['wantsComments'];
  }

  const str = compile(data, wantsComments);
  const buffer = convertStringToBuffer(str, encoding);
  return fs.writeFileSync(file, buffer);
}
