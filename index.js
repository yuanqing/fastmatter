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

var NEWLINE = '\n';

var fastmatter = function(str) {

  var bodyOnly = {
    attributes: {},
    body: str
  };

  var lines = str.split(NEWLINE);

  if (!isSeparator(lines[0])) { // no attributes; entire `str` is body
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

  if (i === lines.length) { // second '---' is missing; assume entire `str` is body
    return bodyOnly;
  }

  return {
    attributes: attributes.length ? jsYaml(attributes.join(NEWLINE)) : {},
    body: lines.slice(i + 1).join(NEWLINE)
  };

};

var SPLIT_REGEX = /(\n)/;

fastmatter.stream = function(cb) {

  cb = cb || noop;

  var isFirstLine = true;
  var bodyFlag = 0;
  var firstSeparator = '';
  var attributes = [];

  var transform = function(chunk, encoding, transformCb) {
    var line = chunk.toString();
    if (bodyFlag === 0) { // not in `body`
      if (isFirstLine) {
        isFirstLine = false;
        if (isSeparator(line)) { // start of `attributes`
          firstSeparator = line; // we need this if the second '---' is missing
        } else { // no attributes; the entire stream is `body`
          bodyFlag = 2; // the next line is the second line of `body`
          cb.call(this, {});
          cb = noop;
          this.push(line);
        }
      } else {
        if (isSeparator(line)) {
          bodyFlag = 1; // the next line is the first line of `body`
          cb.call(this, jsYaml(attributes.join('')) || {});
          cb = noop;
          firstSeparator = '';
          attributes = [];
        } else {
          attributes.push(line);
        }
      }
    } else { // in `body`
      if (bodyFlag === 1) {
        bodyFlag = 2; // the next line is the second line of `body`
        line = line.substring(1); // drop the initial '\n'
      }
      this.push(line);
    }
    transformCb();
  };

  var flush = function(flushCb) {
    cb.call(this, {});
    if (firstSeparator.length) {
      this.push(firstSeparator);
    }
    if (attributes.length) {
      this.push(attributes.join(''));
    }
    flushCb();
  };

  return combine(split(SPLIT_REGEX), through(transform, flush));

};

module.exports = fastmatter;
