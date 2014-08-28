'use strict';

var yamlParser = require('js-yaml');

var isSeparator = function(line) {

  // the '---' separator can have trailing whitespace but not leading whitespace
  return line[0] === '-' && line.trim() === '---';

};

var fastmatter = function(str) {

  var bodyOnly = {
    attributes: {},
    body: str
  };

  var lines = str.split('\n');

  // no attributes; entire `str` is body
  if (!isSeparator(lines[0])) {
    return bodyOnly;
  }

  var attributes = [];
  var i = 1;
  var len = lines.length;
  while (i < len) {
    if (isSeparator(lines[i])) { // end of attributes
      break;
    }
    attributes.push(lines[i]);
    i += 1;
  }

  // second '---' is missing; assume entire `str` is body
  if (i === lines.length) {
    return bodyOnly;
  }

  return {
    attributes: attributes.length ? yamlParser.load(attributes.join('\n')) : {},
    body: lines.slice(i + 1).join('\n')
  };

};

exports = module.exports = fastmatter;
