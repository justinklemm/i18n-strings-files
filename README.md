i18n-strings-files
==================

[![Build Status](https://travis-ci.org/justinklemm/i18n-strings-files.png)](https://travis-ci.org/justinklemm/i18n-strings-files)

Node.js module for processing .strings files used for localization in iOS/OSX development

## Installing with [npm](http://npmjs.org/)

    $ npm install i18n-strings-files

## Usage

i18n-strings-files can be used to read a .strings file and parse it into an object, or to compile an object into .strings format and write it to a file. The intermediate functions for parsing and compiling can also be used directly.

Note that specifying an encoding is optional. If an encoding is not specified, UTF-16 will be used [as recommended by Apple](https://developer.apple.com/library/mac/documentation/macosx/conceptual/bpinternational/Articles/StringsFiles.html). It's important to understand the encoding of the file being read/written and make sure it's specified properly (if it's something other than UTF-16).

### readFile(filename, [encoding], callback)
    // Include i18n-strings-files
    var i18nStringsFiles = require('i18n-strings-files');
    
    // Read 'Localizable.strings' and pass an object containing the key/value pairs to a callback
    i18nStringsFiles.readFile('Localizable.strings', 'UTF-16', function(err, data){
        console.log(data);
    });

### readFileSync(filename, [encoding])
    // Include i18n-strings-files
    var i18nStringsFiles = require('i18n-strings-files');

    // Read 'Localizable.strings' and return it as an object containing the key/value pairs
    var data = i18nStringsFiles.readFileSync('Localizable.strings', 'UTF-16');
    console.log(data);

### writeFile(filename, data, [encoding], callback)
    // Include i18n-strings-files
    var i18nStringsFiles = require('i18n-strings-files');

    // An object containing some properties
    var data = {
        'key1': 'value1',
        'key2': 'value2'
    };
    
    // Write an object containing key/value pairs to file 'Localizable.strings', execute callback when done
    i18nStringsFiles.writeFile('Localizable.strings', data, 'UTF-16', function(err){
        if(err) return console.log(err);
        console.log('File written');
    });

### writeFileSync(filename, data, [encoding])
    // Include i18n-strings-files
    var i18nStringsFiles = require('i18n-strings-files');

    // Write an object containing key/value pairs to file 'Localizable.strings'
    i18nStringsFiles.writeFileSync('Localizable.strings', data, 'UTF-16');
    console.log('File written');

### parse(input)
    // Include i18n-strings-files
    var i18nStringsFiles = require('i18n-strings-files');

    // A string in the .strings file format
    var input = '"key1" = "value1";'
    
    // Parse .strings format string into object containing the key/value pairs
    var data = i18nStringsFiles.parse(input);

### compile(data)
    // Include i18n-strings-files
    var i18nStringsFiles = require('i18n-strings-files');

    // An object containing some properties
    var data = {
        'key1': 'value1',
        'key2': 'value2'
    };
    
    // Compile an object containing key/value pairs into a string in .strings file format
    var str = i18nStringsFiles.compile(data);