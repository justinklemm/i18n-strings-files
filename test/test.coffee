fs = require('fs')
assert = require('assert')
should = require('should')
i18nStringsFiles = require('../index')


fileTest = __dirname + '/test.strings'
fileTemp = __dirname + '/temp.strings'


describe 'Reading file into object', ->
  it 'should populate object properties with values', ->
    data = i18nStringsFiles.readFileSync(fileTest, 'UTF-8')
    data.login_button.should.equal('Log In')


describe 'Read, compile, parse', ->
  it 'should populate object properties with values before and after', ->
    data = i18nStringsFiles.readFileSync(fileTest, 'UTF-8')
    data.login_button.should.equal('Log In')
    str = i18nStringsFiles.compile(data)
    data = i18nStringsFiles.parse(str)
    data.login_button.should.equal('Log In')


describe 'Read, write, read', ->
  it 'should populate object properties with values before and after', ->
    data = i18nStringsFiles.readFileSync(fileTest, 'UTF-8')
    data.login_button.should.equal('Log In')
    i18nStringsFiles.writeFileSync(fileTemp, data, 'UTF-8')
    data = i18nStringsFiles.readFileSync(fileTemp, 'UTF-8')
    fs.unlinkSync(fileTemp)
    data.login_button.should.equal('Log In')
