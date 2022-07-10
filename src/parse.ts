import { I18nStringsFiles, I18nStringsWithCommentEntry } from './types';




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
