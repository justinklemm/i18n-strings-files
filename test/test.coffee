fs = require('fs')
should = require('should')
i18nStringsFiles = require('../index')


fileTemp = __dirname + '/temp.strings'
fileTest = __dirname + '/test.strings'
fileEncoding = 'UTF-16'


checkValues = (data) ->
  data['test-normal'].should.equal("Test normal")
  data['test-chars'].should.equal("Olvidé mi contraseña")
  data['test-new-lines'].should.equal("Test\nNew\nLines")
  data['test-quotes'].should.equal("\"Test quote\"")
  data['test-semicolon'].should.equal("Test \"; semicolon")
  data['test-spacing'].should.equal("Test spacing")
  data['test \n edge" = '].should.equal("Test edge")
  data['test-multiline-comment'].should.equal("Test multiline comment")
  data['test-multiline-value'].should.equal("Test\nmultiline\nvalue")
  data['test-multiline-value-with-space'].should.equal("Test\nmultiline\n\nwith\n\nempty space\nvalue")



checkValuesWithComments = (data) ->
  data['test-normal']['text'].should.equal("Test normal")
  data['test-normal']['comment'].should.equal("Normal")
  data['test-chars']['text'].should.equal("Olvidé mi contraseña")
  data['test-chars']['comment'].should.equal("Special characters")
  data['test-new-lines']['text'].should.equal("Test\nNew\nLines")
  data['test-new-lines']['comment'].should.equal("Escaped new lines")
  data['test-quotes']['text'].should.equal("\"Test quote\"")
  data['test-quotes']['comment'].should.equal("Escaped quotes")
  data['test-semicolon']['text'].should.equal("Test \"; semicolon")
  data['test-semicolon']['comment'].should.equal("Quote and semicolon case")
  data['test-spacing']['text'].should.equal("Test spacing")
  data['test-spacing']['comment'].should.equal("Messed up spacing")
  data['test \n edge" = ']['text'].should.equal("Test edge")
  data['test \n edge" = ']['comment'].should.equal("Edge case")
  data['test-multiline-comment']['text'].should.equal("Test multiline comment")
  data['test-multiline-comment']['comment'].should.equal("Multiline\nComment")
  data['test-multiline-value']['text'].should.equal("Test\nmultiline\nvalue")
  data['test-multiline-value']['comment'].should.equal("Multiline Value")
  data['test-multiline-value-with-space']['text'].should.equal("Test\nmultiline\n\nwith\n\nempty space\nvalue")
  data['test-multiline-value-with-space']['comment'].should.equal("Multiline Value with space")




describe 'Sync: Reading file into object', ->
  it 'should populate object properties with values', ->
    data = i18nStringsFiles.readFileSync(fileTest, fileEncoding)
    checkValues(data)
  it 'should populate object properties with values (wantsComments = true)', ->
    data = i18nStringsFiles.readFileSync(fileTest, { 'encoding' : fileEncoding, 'wantsComments' : true })
    checkValuesWithComments(data)

describe 'Sync: Read, compile, parse', ->
  it 'should populate object properties with values before and after', ->
    data = i18nStringsFiles.readFileSync(fileTest, fileEncoding)
    checkValues(data)
    str = i18nStringsFiles.compile(data)
    data = i18nStringsFiles.parse(str)
    checkValues(data)
  it 'should populate object properties with values before and after (wantsComments = true)', ->
    data = i18nStringsFiles.readFileSync(fileTest, { 'encoding' : fileEncoding, 'wantsComments' : true })
    checkValuesWithComments(data)
    str = i18nStringsFiles.compile(data, true)
    data = i18nStringsFiles.parse(str, true)
    checkValuesWithComments(data)


describe 'Sync: Read, write, read', ->
  it 'should populate object properties with values before and after', ->
    data = i18nStringsFiles.readFileSync(fileTest, fileEncoding)
    checkValues(data)
    i18nStringsFiles.writeFileSync(fileTemp, data, fileEncoding)
    data = i18nStringsFiles.readFileSync(fileTemp, fileEncoding)
    checkValues(data)
    fs.unlinkSync(fileTemp)
  it 'should populate object properties with values before and after (wantsComments = true)', ->
    data = i18nStringsFiles.readFileSync(fileTest, { 'encoding' : fileEncoding, 'wantsComments' : true })
    checkValuesWithComments(data)
    i18nStringsFiles.writeFileSync(fileTemp, data, { 'encoding' : fileEncoding, 'wantsComments' : true })
    data = i18nStringsFiles.readFileSync(fileTemp, { 'encoding' : fileEncoding, 'wantsComments' : true })
    checkValuesWithComments(data)
    fs.unlinkSync(fileTemp)


describe 'Async: Reading file into object', ->
  it 'should populate object properties with values', (done) ->
    i18nStringsFiles.readFile fileTest, fileEncoding, (err, data) ->
      checkValues(data)
      done()
  it 'should populate object properties with values (wantsComments = true)', (done) ->
    i18nStringsFiles.readFile fileTest, { 'encoding' : fileEncoding, 'wantsComments' : true }, (err, data) ->
      checkValuesWithComments(data)
      done()


describe 'Async: Read, write, read', ->
  it 'should populate object properties with values before and after', (done) ->
    i18nStringsFiles.readFile fileTest, fileEncoding, (err, data) ->
      checkValues(data)
      i18nStringsFiles.writeFile fileTemp, data, fileEncoding, (err) ->
        i18nStringsFiles.readFile fileTemp, fileEncoding, (err, data) ->
          checkValues(data)
          fs.unlinkSync(fileTemp)
          done()
  it 'should populate object properties with values before and after (wantsComments = true)', (done) ->
    i18nStringsFiles.readFile fileTest, { 'encoding' : fileEncoding, 'wantsComments' : true }, (err, data) ->
      checkValuesWithComments(data)
      i18nStringsFiles.writeFile fileTemp, data, { 'encoding' : fileEncoding, 'wantsComments' : true }, (err) ->
        i18nStringsFiles.readFile fileTemp, { 'encoding' : fileEncoding, 'wantsComments' : true }, (err, data) ->
          checkValuesWithComments(data)
          fs.unlinkSync(fileTemp)
          done()


describe 'Async: Read, write, read (no encoding param)', ->
  it 'should populate object properties with values before and after', (done) ->
    i18nStringsFiles.readFile fileTest, (err, data) ->
      checkValues(data)
      i18nStringsFiles.writeFile fileTemp, data, (err) ->
        i18nStringsFiles.readFile fileTemp, (err, data) ->
          checkValues(data)
          fs.unlinkSync(fileTemp)
          done()

describe 'Compilation', ->
  it 'shall replace windows-style CRLF newlines with LF(mac/unix) newlines', (done) ->
    # Given: a dictionary containing a value string with CRLF newlines
    crlfDict = { aKey: 'Test\r\nNew\r\nLines' };

    # When: the dictionary is compiled to strings file format
    stringsFileContent = i18nStringsFiles.compile(crlfDict);

    # Then: the resulting content shall match the content crated for LF-only source
    lfDict = { aKey: 'Test\nNew\nLines' };
    stringsFileContent.should.equal(i18nStringsFiles.compile(lfDict));

    done()
