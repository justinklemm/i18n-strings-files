fs = require('fs')
Iconv  = require('iconv').Iconv


i18nStringsFiles = ->


i18nStringsFiles.prototype.readFile = (file, options, callback) ->
  encoding = null
  wantsComments = false
  # check if encoding was excluded and callback specified as 2nd param
  if typeof callback == "undefined" and typeof options == "function"
    callback = options
    encoding = null
  else if typeof options == "string" # for backward compatibility
    encoding = options
  else if typeof options == "object"
    encoding = options['encoding']
    wantsComments = options['wantsComments']

  # read passed in file
  fs.readFile file, (err, buffer) =>
    # if there's an error, callback with it and return
    if err then return callback?(err, null)
    # convert buffer from file into utf-8 string, then parse
    str = @convertBufferToString(buffer, encoding)
    data = @parse(str, wantsComments)
    # callback with parsed object
    callback?(null, data)

i18nStringsFiles.prototype.readFileSync = (file, options) ->
  encoding = null
  wantsComments = false
  if typeof options == 'string'
    encoding = options
  else if typeof options == 'object'
    encoding = options['encoding']
    wantsComments = options['wantsComments']

  # read the passed in file and convert to utf-8 string
  buffer = fs.readFileSync(file)
  str = @convertBufferToString(buffer, encoding)

  # pass file contents string to parse() and return
  return @parse(str, wantsComments)


i18nStringsFiles.prototype.writeFile = (file, data, options, callback) ->
  encoding = null
  wantsComments = false
  # check if encoding was excluded and callback specified as 2nd param
  if typeof callback == "undefined" and typeof options == "function"
    callback = options
    encoding = null
  else if typeof options == "string" # for backward compatibility
    encoding = options
  else if typeof options == "object"
    encoding = options['encoding']
    wantsComments = options['wantsComments']
  # build string and convert from utf-8 to output buffer
  str = @compile(data, options)
  buffer = @convertStringToBuffer(str, encoding)
  # write buffer to file
  fs.writeFile file, buffer, (err) =>
    # callback with any errors
    callback?(err)


i18nStringsFiles.prototype.writeFileSync = (file, data, options) ->
  encoding = null
  wantsComments = false
  if typeof options == 'string'
    encoding = options
  else if typeof options == 'object'
    encoding = options['encoding']
    wantsComments = options['wantsComments']

  # build string and convert from utf-8 to output buffer
  str = @compile(data, options)
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


i18nStringsFiles.prototype.parse = (input, wantsComments) ->
  # if wantsComments is not specified, default to false
  if !wantsComments then wantsComments = false
  # patterns used for parsing
  reAssign = /[^\\]" = "/
  reLineEnd = /";$/
  reCommentEnd = /\*\/$/
  # holds resulting hash
  result = {}
  # splt into lines
  lines = input.split("\n")

  # previous comment
  currentComment = ''
  currentValue = ''
  currentId = ''
  nextLineIsComment = false
  nextLineIsValue = false

  # process line by line
  lines.forEach (line) ->
    # strip extra whitespace
    line = line.trim()
    # normalize spacing around assignment operator
    line = line.replace(/([^\\])("\s*=\s*")/g, "$1\" = \"")
    # remove any space between final quote and semi-colon
    line = line.replace(/"\s+;/g, '";')

    # check if starts with '/*', store it in currentComment var
    if nextLineIsComment
      if line.search(reCommentEnd) == -1
        currentComment += '\n' + line.trim()
        return
      else
        nextLineIsComment = false
        currentComment += '\n' + line.substr(0, line.search(reCommentEnd)).trim()
        return
    else if line.substr(0, 2) == '/*'
      if line.search(reCommentEnd) == -1
        nextLineIsComment = true
        currentComment = line.substr(2).trim()
        return
      else
        nextLineIsComment = false
        currentComment = line.substr(2, line.search(reCommentEnd)-2).trim()
        return

    msgid = ''
    msgstr = ''

    if line == '' && !nextLineIsValue
      return

    # check if starts with '/*', store it in currentComment var
    if nextLineIsValue
      if line.search(reLineEnd) == -1
        currentValue += '\n' + line.trim()
        return
      else
        nextLineIsValue = false
        currentValue += '\n' + line.substr(0, line.search(reLineEnd)).trim()
        msgid = currentId
        msgstr = currentValue
        currentId = ''
        currentValue = ''
    else if line.search(reLineEnd) == -1 && !nextLineIsComment
      nextLineIsValue = true
      currentId = line
      currentId = currentId.substr(1)
      currentId = currentId.substr(0, currentId.search(reAssign) + 1)
      currentId = currentId.replace(/\\"/g, "\"")
      currentValue = line
      currentValue = currentValue.substr(currentValue.search(reAssign) + 6)
      return
    else
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
    if !wantsComments then result[msgid] = msgstr
    else
      val = { 'text': msgstr }
      if currentComment
        val['comment'] = currentComment
        currentComment = ''
      result[msgid] = val

  # return resulting object
  return result

i18nStringsFiles.prototype.compile = (data, wantsComments) ->
  # if wantsComments is not specified, default to false
  if !wantsComments then wantsComments = false
  # make sure data is an object
  if typeof data != "object" then return ""
  # output string
  output = ""
  # loop through hash
  for msgid, val of data
    msgstr = ''
    comment = null
    if typeof val == 'string' then msgstr = val
    else
      if val.hasOwnProperty('text') then msgstr = val['text']
      if wantsComments and val.hasOwnProperty('comment') then comment = val['comment']

    # escape quotes in msgid, msgstr
    msgid = msgid.replace(/"/g, "\\\"")
    msgstr = msgstr.replace(/"/g, "\\\"")
    # escape new lines in msgid, msgstr
    msgid = msgid.replace(/\n/g, "\\n")
    msgstr = msgstr.replace(/\r?\n/g, "\\n")
    # add comment if available
    if comment then output = output + "/* " + comment + " */\n"
    # add line to output
    output = output + "\"" + msgid + "\" = \"" + msgstr + "\";\n"
  # return output string
  return output


module.exports = new i18nStringsFiles
