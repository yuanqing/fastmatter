/* globals describe, it, expect, jasmine */
'use strict';

var fastmatter = require('..');
var fs = require('fs');

describe('fastmatter.parse(str)', function() {

  it('should parse the entire `str` as the body if the first line is not "---"', function() {
    var arr = [
      '',
      'foo',
      '\n---\n---'
    ];
    arr.forEach(function(elem) {
      expect(fastmatter.parse(elem)).toEqual({
        attributes: {},
        body: elem
      });
    });
  });

  it('should parse the entire `str` as the body if the second "---" is missing', function() {
    var arr = [
      '---',
      '---\nfoo'
    ];
    arr.forEach(function(elem) {
      expect(fastmatter.parse(elem)).toEqual({
        attributes: {},
        body: elem
      });
    });
  });

  it('should parse empty frontmatter and body', function() {
    var arr = [
      '---\n---',
      '---\n---\n'
    ];
    arr.forEach(function(elem) {
      expect(fastmatter.parse(elem)).toEqual({
        attributes: {},
        body: ''
      });
    });
  });

  it('should parse frontmatter without body', function() {
    expect(fastmatter.parse('---\nfoo: bar\n---')).toEqual({
      attributes: { foo: 'bar' },
      body: ''
    });
  });

  it('should parse body without frontmatter', function() {
    expect(fastmatter.parse('---\n---\nfoo')).toEqual({
      attributes: {},
      body: 'foo'
    });
  });

  it('should parse both frontmatter and body', function() {
    var arr = [
      ['---\nfoo: bar\n---\nbaz', { foo: 'bar' }, 'baz'],
      ['---\nfoo: bar\n---\n\n', { foo: 'bar' }, '\n']
    ];
    arr.forEach(function(elem) {
      expect(fastmatter.parse(elem[0])).toEqual({
        attributes: elem[1],
        body: elem[2]
      });
    });
  });

});

describe('fastmatter.parseFile(file, cb)', function() {

  it('should parse `file`, and return the results via the `cb` callback', function(done) {
    fastmatter.parseFile(__dirname + '/fixtures/foo.md', function(err, data) {
      expect(data).toEqual({
        attributes: { foo: 'bar' },
        body: 'baz\n'
      });
      done();
    });
  });

  it('should return an `err` if `tmplFile` does not exist', function(done) {
    var dummyFile = 'foo';
    expect(fs.existsSync(dummyFile)).toBe(false);
    fastmatter.parseFile(dummyFile, function(err) {
      expect(err).toEqual(jasmine.any(Error));
      done();
    });
  });

});
