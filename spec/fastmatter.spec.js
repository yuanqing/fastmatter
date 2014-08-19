/* globals describe, it, expect */
'use strict';

var fastmatter = require('..');

describe('fastmatter(str)', function() {

  it('should parse the entire `str` as the body if the first line is not "---"', function() {
    var arr = [
      '',
      'foo',
      '\n---\n---'
    ];
    arr.forEach(function(elem) {
      expect(fastmatter(elem)).toEqual({
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
      expect(fastmatter(elem)).toEqual({
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
      expect(fastmatter(elem)).toEqual({
        attributes: {},
        body: ''
      });
    });
  });

  it('should parse frontmatter without body', function() {
    expect(fastmatter('---\nfoo: bar\n---')).toEqual({
      attributes: { foo: 'bar' },
      body: ''
    });
  });

  it('should parse body without frontmatter', function() {
    expect(fastmatter('---\n---\nfoo')).toEqual({
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
      expect(fastmatter(elem[0])).toEqual({
        attributes: elem[1],
        body: elem[2]
      });
    });
  });

});
