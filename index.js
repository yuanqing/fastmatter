'use strict';

var yamlParser = require('js-yaml');

var fastmatter = function(str) {

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

exports = module.exports = fastmatter;
