'use strict';

var fastmatter = require('..');

var concat = require('concat-stream');
var each = require('savoy').each;
var Readable = require('stream').Readable;

var missingFirstSeparator = [
  ['', {}, ''],
  ['foo', {}, 'foo'],
  ['\n---\n---', {}, '\n---\n---'],
  [' ---\nfoo: bar\n---\nbaz', {}, ' ---\nfoo: bar\n---\nbaz']
];
var missingSecondSeparator = [
  ['---', {}, '---'],
  ['---\n', {}, '---\n'],
  ['---\nfoo', {}, '---\nfoo'],
  ['---\n ---', {}, '---\n ---'],
  ['---\nfoo: bar\n ---\nbaz', {}, '---\nfoo: bar\n ---\nbaz']
];
var emptyFrontmatterAndBody = [
  ['---\n---', {}, ''],
  ['---\n---\n', {}, ''],
  ['--- \n--- ', {}, ''],
  ['--- \n--- \n', {}, '']
];
var frontmatterWithoutBody = [
  ['---\nfoo: bar\n---', { foo: 'bar' }, ''],
  ['---\nfoo: bar\n---\n', { foo: 'bar' }, ''],
  ['--- \nfoo: bar\n--- ', { foo: 'bar' }, ''],
  ['--- \nfoo: bar\n--- \n', { foo: 'bar' }, '']
];
var bodyWithoutFrontmatter = [
  ['---\n---\nfoo', {}, 'foo'],
  ['--- \n--- \nfoo', {}, 'foo']
];
var frontmatterAndBody = [
  ['---\nfoo: bar\n---\nbaz', { foo: 'bar' }, 'baz'],
  ['---\nfoo: bar\n---\n\n', { foo: 'bar' }, '\n'],
  ['--- \nfoo: bar\n--- \nbaz', { foo: 'bar' }, 'baz'],
  ['--- \nfoo: bar\n--- \n\n', { foo: 'bar' }, '\n']
];

describe('fastmatter(str)', function() {

  var helper = function(fixtures) {
    each(fixtures, function(f) {
      expect(fastmatter(f[0])).toEqual({
        attributes: f[1],
        body: f[2]
      });
    });
  };

  it('treats the entire `str` as the body if the first line is not "---"', function() {
    helper(missingFirstSeparator);
  });

  it('treats the entire `str` as the body if the second "---" is missing', function() {
    helper(missingSecondSeparator);
  });

  it('can parse empty frontmatter and body', function() {
    helper(emptyFrontmatterAndBody);
  });

  it('can parse frontmatter without body', function() {
    helper(frontmatterWithoutBody);
  });

  it('can parse body without frontmatter', function() {
    helper(bodyWithoutFrontmatter);
  });

  it('can parse both frontmatter and body', function() {
    helper(frontmatterAndBody);
  });

});

describe('fastmatter.stream([cb])', function() {

  var helper = function(done, fixtures) {
    each(fixtures, function(cb, f) {
      var rs = new Readable();
      rs.push(f[0]);
      rs.push(null);
      rs.pipe(fastmatter.stream(function(attributes) {
        expect(attributes).toEqual(f[1]);
        this.pipe(concat(function(body) {
          expect(body.toString()).toEqual(f[2]);
          cb();
        }));
      }));
    }, function() {
      done();
    });
  };

  it('treats the entire stream as the body if the first line is not "---"', function(done) {
    helper(done, missingFirstSeparator);
  });

  it('treats the entire stream as the body if the second "---" is missing', function(done) {
    helper(done, missingSecondSeparator);
  });

  it('can parse empty frontmatter and body', function(done) {
    helper(done, emptyFrontmatterAndBody);
  });

  it('can parse frontmatter without body', function(done) {
    helper(done, frontmatterWithoutBody);
  });

  it('can parse body without frontmatter', function(done) {
    helper(done, bodyWithoutFrontmatter);
  });

  it('can parse both frontmatter and body', function(done) {
    helper(done, frontmatterAndBody);
  });

  it('can be called without `cb`', function(done) {
    var f = frontmatterAndBody[0];
    var rs = new Readable();
    rs.push(f[0]);
    rs.push(null);
    rs.pipe(fastmatter.stream())
      .pipe(concat(function(body) {
        expect(body.toString()).toEqual(f[2]);
        done();
      }));
  });

});
