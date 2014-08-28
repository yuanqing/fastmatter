/* globals describe, it, expect */
'use strict';

var fastmatter = require('..');

describe('fastmatter(str)', function() {

  it('treats the entire `str` as the body if the first line is not "---"', function() {
    var fixtures = [
      '',
      'foo',
      '\n---\n---',
      ' ---\nfoo: bar\n---\nbaz', // '---' cannot have leading whitespace
    ];
    fixtures.forEach(function(str) {
      expect(fastmatter(str)).toEqual({
        attributes: {},
        body: str
      });
    });
  });

  it('treats the entire `str` as the body if the second "---" is missing', function() {
    var fixtures = [
      '---',
      '---\n',
      '---\nfoo',
      '---\n ---', // '---' cannot have leading whitespace
      '---\nfoo: bar\n ---\nbaz',
    ];
    fixtures.forEach(function(str) {
      expect(fastmatter(str)).toEqual({
        attributes: {},
        body: str
      });
    });
  });

  it('can parse empty frontmatter and body', function() {
    var fixtures = [
      '---\n---',
      '---\n---\n',
      '--- \n--- ', // '---' can have trailing whitespace
      '--- \n--- \n'
    ];
    fixtures.forEach(function(str) {
      expect(fastmatter(str)).toEqual({
        attributes: {},
        body: ''
      });
    });
  });

  it('can parse frontmatter without body', function() {
    var fixtures = [
      '---\nfoo: bar\n---',
      '---\nfoo: bar\n---\n',
      '--- \nfoo: bar\n--- ', // '---' can have trailing whitespace
      '--- \nfoo: bar\n--- \n'
    ];
    fixtures.forEach(function(str) {
      expect(fastmatter(str)).toEqual({
        attributes: { foo: 'bar' },
        body: ''
      });
    });
  });

  it('can parse body without frontmatter', function() {
    var fixtures = [
      '---\n---\nfoo',
      '--- \n--- \nfoo' // '---' can have trailing whitespace
    ];
    fixtures.forEach(function(str) {
      expect(fastmatter(str)).toEqual({
        attributes: {},
        body: 'foo'
      });
    });
  });

  it('can parse both frontmatter and body', function() {
    var fixtures = [
      ['---\nfoo: bar\n---\nbaz', { foo: 'bar' }, 'baz'],
      ['---\nfoo: bar\n---\n\n', { foo: 'bar' }, '\n'],
      ['--- \nfoo: bar\n--- \nbaz', { foo: 'bar' }, 'baz'], // '---' can have trailing whitespace
      ['--- \nfoo: bar\n--- \n\n', { foo: 'bar' }, '\n']
    ];
    fixtures.forEach(function(f) {
      expect(fastmatter(f[0])).toEqual({
        attributes: f[1],
        body: f[2]
      });
    });
  });

});
