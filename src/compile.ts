import { I18nStringsFiles } from './types';


export function compile(data: I18nStringsFiles, wantsComments?: boolean): string {
  // if wantsComments is not specified, default to false
  if (typeof wantsComments === 'undefined') {
    wantsComments = false;
  }
  // make sure data is an object
  if (typeof data !== 'object') {
    return '';
  }
  // output string
  let output = '';
  // loop through hash
  for (var msgid in data) {
    if (data.hasOwnProperty(msgid)) {
      const val = data[msgid];
      let msgstr = '';
      let comment = null;
      if (typeof val === 'string') {
        msgstr = val;
      } else {
        if (val.hasOwnProperty('text')) {
          msgstr = val['text'];
        }
        if (wantsComments && val.hasOwnProperty('comment')) {
          comment = val['comment'];
        }
      }

      // escape quotes in msgid, msgstr
      msgid = msgid.replace(/"/g, "\\\"");
      msgstr = msgstr.replace(/"/g, "\\\"");
      // escape new lines in msgid, msgstr
      msgid = msgid.replace(/\n/g, "\\n");
      msgstr = msgstr.replace(/\r?\n/g, "\\n");
      // add comment if available
      if (comment) {
        output = output + '/* ' + comment + ' */\n';
      }
      // add line to output
      output = output + '"' + msgid + '" = "' + msgstr + '";\n';
    }
  }
  // return output string
  return output;
}
