import fs from 'fs';
import path from 'path';
import { compile, parse, readFile, readFileSync, writeFile } from '../index';
import { I18nStringFileWithComment, I18nStringsFiles } from '../types';

const fileTemp = path.resolve(__dirname, './temp.strings');
const fileTest = path.resolve(__dirname, './test.strings');
const fileEncoding = 'UTF-16';

const checkValues = (data: I18nStringsFiles) => {
  expect(data['test-normal']).toEqual('Test normal');
  expect(data['test-chars']).toEqual('Olvidé mi contraseña');
  expect(data['test-new-lines']).toEqual('Test\nNew\nLines');
  expect(data['test-quotes']).toEqual('"Test quote"');
  expect(data['test-semicolon']).toEqual('Test \"; semicolon');
  expect(data['test-spacing']).toEqual('Test spacing');
  expect(data['test \n edge" = ']).toEqual('Test edge');
  expect(data['test-multiline-comment']).toEqual('Test multiline comment');
  expect(data['test-multiline-value']).toEqual('Test\nmultiline\nvalue');
  expect(data['test-multiline-value-with-space']).toEqual('Test\nmultiline\n\nwith\n\nempty space\nvalue');
  expect(data['test-multiline-value-with-comment']).toEqual('Test\nmultiline\nvalue\nwith comment\n/* comment */\n');
};


const checkValuesWithComments = (inputData: I18nStringsFiles) => {
  const data = inputData as I18nStringFileWithComment;

  expect(data['test-normal']['text']).toEqual('Test normal');
  expect(data['test-normal']['comment']).toEqual('Normal');
  expect(data['test-chars']['text']).toEqual('Olvidé mi contraseña');
  expect(data['test-chars']['comment']).toEqual('Special characters');
  expect(data['test-new-lines']['text']).toEqual('Test\nNew\nLines');
  expect(data['test-new-lines']['comment']).toEqual('Escaped new lines');
  expect(data['test-quotes']['text']).toEqual('"Test quote"');
  expect(data['test-quotes']['comment']).toEqual('Escaped quotes');
  expect(data['test-semicolon']['text']).toEqual('Test \"; semicolon');
  expect(data['test-semicolon']['comment']).toEqual('Quote and semicolon case');
  expect(data['test-spacing']['text']).toEqual('Test spacing');
  expect(data['test-spacing']['comment']).toEqual('Messed up spacing');
  expect(data['test \n edge" = ']['text']).toEqual('Test edge');
  expect(data['test \n edge" = ']['comment']).toEqual('Edge case');
  expect(data['test-multiline-comment']['text']).toEqual('Test multiline comment');
  expect(data['test-multiline-comment']['comment']).toEqual('Multiline\nComment');
  expect(data['test-multiline-value']['text']).toEqual('Test\nmultiline\nvalue');
  expect(data['test-multiline-value']['comment']).toEqual('Multiline Value');
  expect(data['test-multiline-value-with-space']['text']).toEqual('Test\nmultiline\n\nwith\n\nempty space\nvalue');
  expect(data['test-multiline-value-with-space']['comment']).toEqual('Multiline Value with space');
  expect(data['test-multiline-value-with-comment']['text']).toEqual('Test\nmultiline\nvalue\nwith comment\n/* comment */\n');
  expect(data['test-multiline-value-with-comment']['comment']).toEqual('Multiline Value with comment');
};


describe('Sync: Read, compile, parse', () => {
  it('should populate object properties with values before and after', () => {
    const data = readFileSync(fileTest, fileEncoding);
    const str = compile(data);
    const data2 = parse(str);
    checkValues(data2);
  });
  it('should populate object properties with values before and after (wantsComments = true)', () => {
    const data = readFileSync(fileTest, { encoding: fileEncoding, wantsComments: true });
    const str = compile(data, true);
    const data2 = parse(str, true);
    checkValuesWithComments(data2);
  }
  );
});



describe('Sync: Reading file into object', () => {
  it('should populate object properties with values', () => {
    const data = readFileSync(fileTest, fileEncoding);
    checkValues(data);
  });
  it('should populate object properties with values (wantsComments = true)', () => {
    const data = readFileSync(fileTest, { encoding: fileEncoding, wantsComments: true });
    checkValuesWithComments(data);
  });
});



describe('Async: Read, compile, parse', () => {
  it('should populate object properties with values before and after', (done) => {
    readFile(fileTest, fileEncoding, (err, data) => {
      if (err) {
        done.fail();
      }
      if (!data) {
        done.fail();
      }
      const str = compile(data!);
      const result = parse(str);
      checkValues(result);
      done();
    });
  }
  );
  it('should populate object properties with values before and after (wantsComments = true)', (done) => {
    readFile(fileTest, { encoding: fileEncoding, wantsComments: true }, (err, data) => {
      if (!data || err) {
        done.fail();
      }
      const str = compile(data!, true);
      const result = parse(str, true);
      checkValuesWithComments(result);
      done();
    }
    );
  }
  );
});


describe('Async: Read, write, read', () => {
  it('should populate object properties with values before and after', (done) => {
    readFile(fileTest, fileEncoding, (err, data) => {
      if (err) {
        done.fail();
      }
      if (!data) {
        done.fail();
      }
      writeFile(fileTemp, data!, { encoding: fileEncoding }, (err) => {
        if (err) {
          done.fail();
        }
        readFile(fileTemp, fileEncoding, (err, data) => {
          if (err) {
            done.fail();
          }
          checkValues(data!);
          fs.unlinkSync(fileTemp);
          done();
        });
      });
    });
  });

  it('should populate object properties with values before and after (wantsComments = true)', (done) => {
    readFile(fileTest, { encoding: fileEncoding, wantsComments: true }, (err, data) => {
      if (!data || err) {
        done.fail();
      }
      writeFile(fileTemp, data!, { encoding: fileEncoding, wantsComments: true }, (err) => {
        if (err) {
          done.fail();
        }
        readFile(fileTemp, { encoding: fileEncoding, wantsComments: true }, (err, data) => {
          if (err) {
            done.fail();
          }
          checkValuesWithComments(data!);
          fs.unlinkSync(fileTemp);
          done();
        });
      });
    });
  }
  );
});

describe('Async: Read, write, read (no encoding param)', () => {
  it('should populate object properties with values before and after', (done) => {
    readFile(fileTest, (err, data) => {
      if (err) {
        done.fail();
      }
      if (!data) {
        done.fail();
      }
      writeFile(fileTemp, data!, (err) => {
        if (err) {
          done.fail();
        }
        readFile(fileTemp, (err, data) => {
          if (err) {
            done.fail();
          }
          checkValues(data!);
          fs.unlinkSync(fileTemp);
          done();
        });
      });
    });
  }
  );
})


describe('Compilation', () => {
  it('shall replace windows-style CRLF newlines with LF(mac/unix) newlines', (done) => {
    // Given: a dictionary containing a value string with CRLF newlines
    const crlfDict = { aKey: 'Test\r\nNew\r\nLines' };

    // When: the dictionary is compiled to strings file format
    const stringsFileContent = compile(crlfDict);

    // Then: the resulting content shall match the content crated for LF-only source
    const lfDict = { aKey: 'Test\nNew\nLines' };
    expect(stringsFileContent).toBe(compile(lfDict));

    done();
  }
  );
});
