fs = require('fs')
Iconv  = require('iconv').Iconv


i18nStringsFiles = ->


i18nStringsFiles.prototype.readFile = (file, encoding, callback) ->
  # read passed in file
  fs.readFile file, (err, buffer) =>
    # if there's an error, callback with it and return
    if err then return callback?(err, null)
    # convert buffer from file into utf-8 string, then parse
    str = @convertBufferToString(buffer, encoding)
    data = @parse(str)
    # callback with parsed object
    callback?(null, data)


i18nStringsFiles.prototype.readFileSync = (file, encoding) ->
  # read the passed in file and convert to utf-8 string
  buffer = fs.readFileSync(file)
  str = @convertBufferToString(buffer, encoding)
  # pass file contents string to parse() and return
  return @parse(str)


i18nStringsFiles.prototype.writeFile = (file, data, encoding, callback) ->
  # build string and convert from utf-8 to output buffer
  str = @compile(data)
  buffer = @convertStringToBuffer(str, encoding)
  # write buffer to file
  fs.writeFile file, buffer, (err) =>
    # callback with any errors
    callback?(err)


i18nStringsFiles.prototype.writeFileSync = (file, data, encoding) ->
  # build string and convert from utf-8 to output buffer
  str = @compile(data)
  buffer = @convertStringToBuffer(str, encoding)
  # write buffer to file
  return fs.writeFileSync(file, buffer)


i18nStringsFiles.prototype.convertBufferToString = (buffer, encoding) ->
  # if no encoding is passed in, default to utf-16 (as recommended by Apple)
  if !encoding then encoding = 'UTF-16'
  # convert buffer to utf-8 string and return
  iconv = new Iconv(encoding, 'UTF-8')
  return iconv.convert(buffer).toString('utf8')


i18nStringsFiles.prototype.convertStringToBuffer = (str, encoding) ->
  # if no encoding is passed in, default to utf-16 (as recommended by Apple)
  if !encoding then encoding = 'UTF-16'
  # convert string from utf-8 to buffer in output encoding
  iconv = new Iconv('UTF-8', encoding)
  return iconv.convert(str)


i18nStringsFiles.prototype.parse = (input) ->
  # patterns used for parsing
  reAssign = /[^\\]" = "/
  reLineEnd = /";$/
  # holds resulting hash
  result = {}
  # splt into lines
  lines = input.split("\n")
  # process line by line
  lines.forEach (line) ->
    # strip extra whitespace
    line = line.trim()
    # normalize spacing around assignment operator
    line = line.replace(/([^\\])("\s*=\s*")/g, "$1\" = \"")
    # remove any space between final quote and semi-colon
    line = line.replace(/"\s+;/g, '";')
    # check for first quote, assignment operator, and final semi-colon
    if line.substr(0, 1) != '"' or line.search(reAssign) == -1 or line.search(reLineEnd) == -1 then return
    # get msgid
    msgid = line
    msgid = msgid.substr(1)
    msgid = msgid.substr(0, msgid.search(reAssign) + 1)
    # get msg str
    msgstr = line
    msgstr = msgstr.substr(msgstr.search(reAssign) + 6)
    msgstr = msgstr.substr(0, msgstr.search(reLineEnd))
    # convert escaped quotes
    msgid = msgid.replace(/\\"/g, "\"")
    msgstr = msgstr.replace(/\\"/g, "\"")
    # convert escaped new lines
    msgid = msgid.replace(/\\n/g, "\n")
    msgstr = msgstr.replace(/\\n/g, "\n")
    # store values in object
    result[msgid] = msgstr
  # return resulting object
  return result


i18nStringsFiles.prototype.compile = (data) ->
  # make sure data is an object
  if typeof data != "object" then return ""
  # output string
  output = ""
  # loop through hash
  for msgid, msgstr of data
    # escape quotes in msgid, msgstr
    msgid = msgid.replace(/"/g, "\\\"")
    msgstr = msgstr.replace(/"/g, "\\\"")
    # escape new lines in msgid, msgstr
    msgid = msgid.replace(/\n/g, "\\n")
    msgstr = msgstr.replace(/\n/g, "\\n")
    # add line to output
    output = output + "\"" + msgid + "\" = \"" + msgstr + "\";\n"
  # return output string
  return output


module.exports = new i18nStringsFiles