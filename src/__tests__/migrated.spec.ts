// fs = require('fs')
// should = require('should')
// i18nStringsFiles = require('../index')


// fileTemp = __dirname + '/temp.strings'
// fileTest = __dirname + '/test.strings'
// fileEncoding = 'UTF-16'


// checkValuesWithComments = (data) ->
//   data['test-normal']['text'].should.equal("Test normal")
//   data['test-normal']['comment'].should.equal("Normal")
//   data['test-chars']['text'].should.equal("Olvidé mi contraseña")
//   data['test-chars']['comment'].should.equal("Special characters")
//   data['test-new-lines']['text'].should.equal("Test\nNew\nLines")
//   data['test-new-lines']['comment'].should.equal("Escaped new lines")
//   data['test-quotes']['text'].should.equal("\"Test quote\"")
//   data['test-quotes']['comment'].should.equal("Escaped quotes")
//   data['test-semicolon']['text'].should.equal("Test \"; semicolon")
//   data['test-semicolon']['comment'].should.equal("Quote and semicolon case")
//   data['test-spacing']['text'].should.equal("Test spacing")
//   data['test-spacing']['comment'].should.equal("Messed up spacing")
//   data['test \n edge" = ']['text'].should.equal("Test edge")
//   data['test \n edge" = ']['comment'].should.equal("Edge case")
//   data['test-multiline-comment']['text'].should.equal("Test multiline comment")
//   data['test-multiline-comment']['comment'].should.equal("Multiline\nComment")
//   data['test-multiline-value']['text'].should.equal("Test\nmultiline\nvalue")
//   data['test-multiline-value']['comment'].should.equal("Multiline Value")
//   data['test-multiline-value-with-space']['text'].should.equal("Test\nmultiline\n\nwith\n\nempty space\nvalue")
//   data['test-multiline-value-with-space']['comment'].should.equal("Multiline Value with space")
//   data['test-multiline-value-with-comment']['text'].should.equal("Test\nmultiline\nvalue\nwith comment\n/* comment */\n")
//   data['test-multiline-value-with-comment']['comment'].should.equal("Multiline Value with comment")



// describe 'Sync: Reading file into object', ->
//   it 'should populate object properties with values', ->
//     data = i18nStringsFiles.readFileSync(fileTest, fileEncoding)
//     checkValues(data)
//   it 'should populate object properties with values (wantsComments = true)', ->
//     data = i18nStringsFiles.readFileSync(fileTest, { 'encoding' : fileEncoding, 'wantsComments' : true })
//     checkValuesWithComments(data)

// describe 'Sync: Read, compile, parse', ->
//   it 'should populate object properties with values before and after', ->
//     data = i18nStringsFiles.readFileSync(fileTest, fileEncoding)
//     checkValues(data)
//     str = i18nStringsFiles.compile(data)
//     data = i18nStringsFiles.parse(str)
//     checkValues(data)
//   it 'should populate object properties with values before and after (wantsComments = true)', ->
//     data = i18nStringsFiles.readFileSync(fileTest, { 'encoding' : fileEncoding, 'wantsComments' : true })
//     checkValuesWithComments(data)
//     str = i18nStringsFiles.compile(data, true)
//     data = i18nStringsFiles.parse(str, true)
//     checkValuesWithComments(data)


// describe 'Sync: Read, write, read', ->
//   it 'should populate object properties with values before and after', ->
//     data = i18nStringsFiles.readFileSync(fileTest, fileEncoding)
//     checkValues(data)
//     i18nStringsFiles.writeFileSync(fileTemp, data, fileEncoding)
//     data = i18nStringsFiles.readFileSync(fileTemp, fileEncoding)
//     checkValues(data)
//     fs.unlinkSync(fileTemp)
//   it 'should populate object properties with values before and after (wantsComments = true)', ->
//     data = i18nStringsFiles.readFileSync(fileTest, { 'encoding' : fileEncoding, 'wantsComments' : true })
//     checkValuesWithComments(data)
//     i18nStringsFiles.writeFileSync(fileTemp, data, { 'encoding' : fileEncoding, 'wantsComments' : true })
//     data = i18nStringsFiles.readFileSync(fileTemp, { 'encoding' : fileEncoding, 'wantsComments' : true })
//     checkValuesWithComments(data)
//     fs.unlinkSync(fileTemp)


// describe 'Async: Reading file into object', ->
//   it 'should populate object properties with values', (done) ->
//     i18nStringsFiles.readFile fileTest, fileEncoding, (err, data) ->
//       checkValues(data)
//       done()
//   it 'should populate object properties with values (wantsComments = true)', (done) ->
//     i18nStringsFiles.readFile fileTest, { 'encoding' : fileEncoding, 'wantsComments' : true }, (err, data) ->
//       checkValuesWithComments(data)
//       done()


// describe 'Async: Read, write, read', ->
//   it 'should populate object properties with values before and after', (done) ->
//     i18nStringsFiles.readFile fileTest, fileEncoding, (err, data) ->
//       checkValues(data)
//       i18nStringsFiles.writeFile fileTemp, data, fileEncoding, (err) ->
//         i18nStringsFiles.readFile fileTemp, fileEncoding, (err, data) ->
//           checkValues(data)
//           fs.unlinkSync(fileTemp)
//           done()
//   it 'should populate object properties with values before and after (wantsComments = true)', (done) ->
//     i18nStringsFiles.readFile fileTest, { 'encoding' : fileEncoding, 'wantsComments' : true }, (err, data) ->
//       checkValuesWithComments(data)
//       i18nStringsFiles.writeFile fileTemp, data, { 'encoding' : fileEncoding, 'wantsComments' : true }, (err) ->
//         i18nStringsFiles.readFile fileTemp, { 'encoding' : fileEncoding, 'wantsComments' : true }, (err, data) ->
//           checkValuesWithComments(data)
//           fs.unlinkSync(fileTemp)
//           done()


// describe 'Async: Read, write, read (no encoding param)', ->
//   it 'should populate object properties with values before and after', (done) ->
//     i18nStringsFiles.readFile fileTest, (err, data) ->
//       checkValues(data)
//       i18nStringsFiles.writeFile fileTemp, data, (err) ->
//         i18nStringsFiles.readFile fileTemp, (err, data) ->
//           checkValues(data)
//           fs.unlinkSync(fileTemp)
//           done()

// describe 'Compilation', ->
//   it 'shall replace windows-style CRLF newlines with LF(mac/unix) newlines', (done) ->
//     # Given: a dictionary containing a value string with CRLF newlines
//     crlfDict = { aKey: 'Test\r\nNew\r\nLines' };

//     # When: the dictionary is compiled to strings file format
//     stringsFileContent = i18nStringsFiles.compile(crlfDict);

//     # Then: the resulting content shall match the content crated for LF-only source
//     lfDict = { aKey: 'Test\nNew\nLines' };
//     stringsFileContent.should.equal(i18nStringsFiles.compile(lfDict));

//     done()

// rewrite tests from CoffeScript to TypeScript

import fs from 'fs';
import path from 'path';
import { compile, parse, readFileSync } from '../index';
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
