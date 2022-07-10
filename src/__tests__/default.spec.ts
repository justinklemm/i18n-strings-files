import fs from 'fs';
import { convertBufferToString } from "../convertBufferToString";
import { parse } from "../parse";

test('parse', async () => {
  const stringsFileContentBuffer = fs.readFileSync('./test/test.strings');
  const stringsFileContent = convertBufferToString(stringsFileContentBuffer);
  const resultWithNoComment = parse(stringsFileContent);
  const resultWithComment = parse(stringsFileContent, true);

  console.log(stringsFileContent);
  console.log(resultWithComment);
  
});