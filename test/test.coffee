fs = require('fs')
should = require('should')
i18nStringsFiles = require('../index')


fileTemp = __dirname + '/temp.strings'


fileTest = __dirname + '/test.strings'
fileEncoding = 'UTF-8'
fieldName = 'login_button'
fieldValue = 'Log In'


#fileTest = __dirname + '/Localizable.strings'
#fileEncoding = 'UTF-16'
#fieldName = 'payment_confirmation_cta_main'
#fieldValue = 'Reservar mi sesión'


describe 'Sync: Reading file into object', ->
  it 'should populate object properties with values', ->
    data = i18nStringsFiles.readFileSync(fileTest, fileEncoding)
    data[fieldName].should.equal(fieldValue)


describe 'Sync: Read, compile, parse', ->
  it 'should populate object properties with values before and after', ->
    data = i18nStringsFiles.readFileSync(fileTest, fileEncoding)
    data[fieldName].should.equal(fieldValue)
    str = i18nStringsFiles.compile(data)
    data = i18nStringsFiles.parse(str)
    data[fieldName].should.equal(fieldValue)


describe 'Sync: Read, write, read', ->
  it 'should populate object properties with values before and after', ->
    data = i18nStringsFiles.readFileSync(fileTest, fileEncoding)
    data[fieldName].should.equal(fieldValue)
    i18nStringsFiles.writeFileSync(fileTemp, data, fileEncoding)
    data = i18nStringsFiles.readFileSync(fileTemp, fileEncoding)
    data[fieldName].should.equal(fieldValue)
    fs.unlinkSync(fileTemp)


describe 'Async: Reading file into object', ->
  it 'should populate object properties with values', (done) ->
    i18nStringsFiles.readFile fileTest, fileEncoding, (err, data) ->
      data[fieldName].should.equal(fieldValue)
      done()


describe 'Async: Read, write, read', ->
  it 'should populate object properties with values before and after', (done) ->
    i18nStringsFiles.readFile fileTest, fileEncoding, (err, data) ->
      data[fieldName].should.equal(fieldValue)
      i18nStringsFiles.writeFile fileTemp, data, fileEncoding, (err) ->
        i18nStringsFiles.readFile fileTemp, fileEncoding, (err, data) ->
          data[fieldName].should.equal(fieldValue)
          fs.unlinkSync(fileTemp)
          done()
    
