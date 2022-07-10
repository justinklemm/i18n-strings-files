import fs from 'fs';
import { Iconv } from 'iconv';
import { I18nStringsFiles, I18nStringsWithCommentEntry } from './types';



export interface Option {
  encoding?: string;
  wantsComments?: boolean;
}

type OptionLike = Option | string | undefined | Function;

// i18nStringsFiles.prototype.convertBufferToString = (buffer, encoding) ->
//   # if no encoding is passed in, default to utf-16 (as recommended by Apple)
//   if !encoding then encoding = 'UTF-16'
//   # convert buffer to utf-8 string and return
//   iconv = new Iconv(encoding, 'UTF-8')
//   return iconv.convert(buffer).toString('utf8')

export function convertBufferToString(buffer: Buffer, encoding?: string): string {
  // if no encoding is passed in, default to utf-8 (as recommended by Apple)
  if (!encoding) {
    encoding = 'UTF-16';
  }
  // convert buffer to utf-8 string and return
  const iconv = new Iconv(encoding, 'UTF-8');
  return iconv.convert(buffer).toString('utf8');
}

export function convertStringToBuffer(str: string, encoding?: string): Buffer {
  // if no encoding is passed in, default to utf-8 (as recommended by Apple)
  if (!encoding) {
    encoding = 'UTF-16';
  }
  const iconv = new Iconv('UTF-8', encoding);
  return iconv.convert(str);
}

export function readFile(file: string, options: OptionLike, callback: Function) {
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

  fs.readFile(file, (err, buffer) => {
    if (err) {
      return callback(err, null);
    }
    const str = convertBufferToString(buffer, encoding);
    const data = parse(str, wantsComments);
    callback(null, data);
  });
}



export function parse(input: string, wantsComments?: boolean): I18nStringsFiles {
  // if wantsComments is not specified, default to false
  if (typeof wantsComments === 'undefined') {
    wantsComments = false;
  }
  // patterns used for parsing
  const reAssign = /[^\\]" = "/;
  const reLineEnd = /";$/;
  const reCommentEnd = /\*\/$/;
  // holds resulting hash
  const result: I18nStringsFiles = {};
  // splt into lines
  const lines = input.split('\n');

  // previous comment
  let currentComment = '';
  let currentValue = '';
  let currentId = '';
  let nextLineIsComment = false;
  let nextLineIsValue = false;

  // process line by line
  lines.forEach((line) => {
    // strip extra whitespace
    line = line.trim();
    // normalize spacing around assignment operator
    line = line.replace(/([^\\])("\s*=\s*")/g, "$1\" = \"");
    // remove any space between final quote and semi-colon
    line = line.replace(/"\s+;/g, '";');

    // check if starts with '/*', store it in currentComment var
    if (nextLineIsComment) {
      if (line.search(reCommentEnd) === -1) {
        currentComment += '\n' + line.trim();
        return;
      } else {
        nextLineIsComment = false;
        currentComment += '\n' + line.substr(0, line.search(reCommentEnd)).trim();
        return;
      }
    } else if (line.substr(0, 2) === '/*' && !nextLineIsValue) {
      if (line.search(reCommentEnd) === -1) {
        nextLineIsComment = true;
        currentComment = line.substr(2).trim();
        return;
      } else {
        nextLineIsComment = false;
        currentComment = line.substr(2, line.search(reCommentEnd) - 2).trim();
        return;
      }
    }

    let msgid = '';
    let msgstr = '';

    if (line === '' && !nextLineIsValue) {
      return;
    }

    // check if starts with '/*', store it in currentComment var
    if (nextLineIsValue) {
      if (line.search(reLineEnd) === -1) {
        currentValue += '\n' + line.trim();
        return;
      } else {
        nextLineIsValue = false;
        currentValue += '\n' + line.substr(0, line.search(reLineEnd)).trim();
        msgid = currentId;
        msgstr = currentValue;
        currentId = '';
        currentValue = '';
      }
    }
    // get msgid
    else if (line.search(reLineEnd) === -1 && !nextLineIsComment) {
      nextLineIsValue = true;
      currentId = line;
      currentId = currentId.substr(1);
      currentId = currentId.substr(0, currentId.search(reAssign) + 1);
      currentValue = line;
      currentValue = currentValue.substr(currentValue.search(reAssign) + 6);
      return;
    }
    // get msg str
    else {
      // get msgid
      msgid = line;
      msgid = msgid.substr(1);
      msgid = msgid.substr(0, msgid.search(reAssign) + 1);
      // get msg str
      msgstr = line;
      msgstr = msgstr.substr(msgstr.search(reAssign) + 6);
      msgstr = msgstr.substr(0, msgstr.search(reLineEnd));
      // convert escaped quotes
      msgid = msgid.replace(/\\"/g, "\"");
    }

    msgstr = msgstr.replace(/\\"/g, "\"");
    // convert escaped new lines
    msgid = msgid.replace(/\\n/g, "\n");
    msgstr = msgstr.replace(/\\n/g, "\n");

    // store values in object
    if (!wantsComments) {
      result[msgid] = msgstr;
    }
    else {
      const val: I18nStringsWithCommentEntry = { text: msgstr };
      if (currentComment) {
        val.comment = currentComment;
        currentComment = '';
      }
      result[msgid] = val;
    }
  }
  );

  // return resulting object
  return result;
}