'use strict';

var combine = require('stream-combiner');
var jsYaml = require('js-yaml').load;
var noop = function() {};
var split = require('split');
var through = require('through2');

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
    attributes: attributes.length ? jsYaml(attributes.join('\n')) : {},
    body: lines.slice(i + 1).join('\n')
  };

};

fastmatter.stream = function(cb) {

  cb = cb || noop;

  var flag = 0;
  var attributes = [];

  var transform = function(chunk, encoding, transformCb) {
    var line = chunk.toString('utf8');
    if (flag === 2) {
      this.push(line); // pipe the `body` through
      return transformCb();
    }
    if (isSeparator(line)) {
      if (flag === 0) {
        // encountered the first '---'
        flag = 1;
      } else {
        // encountered the second '---', ie. end of `attributes`
        flag = 2;
        cb.bind(this)(jsYaml(attributes.join('\n')));
      }
    } else {
      attributes.push(line);
    }
    transformCb();
  };

  return combine(split(), through(transform));

};

exports = module.exports = fastmatter;
