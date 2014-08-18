'use strict';

var fs = require('fs');
var yamlParser = require('js-yaml');

var fastmatter = {};

fastmatter.parse = function(str) {

  var lines = str.split('\n');

  // no attributes; entire `str` is body
  if (lines[0].trim() !== '---') {
    return {
      attributes: {},
      body: str
    };
  }

  var attributes = [];
  var i = 1;
  var len = lines.length;
  while (i < len) {
    if (lines[i].trim() === '---') { // end of attributes
      break;
    }
    attributes.push(lines[i]);
    i += 1;
  }

  // second '---' is missing; assume entire `str` is body
  if (i === lines.length) {
    return {
      attributes: {},
      body: str
    };
  }

  return {
    attributes: attributes.length ? yamlParser.load(attributes.join('\n')) : {},
    body: lines.slice(i + 1).join('\n')
  };

};

fastmatter.parseFile = function(file, cb) {

  var that = this;

  fs.readFile(file, 'utf-8', function(err, data) {
    if (err) return cb(err);
    cb(null, that.parse(data));
  });

};

exports = module.exports = fastmatter;
