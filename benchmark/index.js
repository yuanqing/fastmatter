/* globals suite, set, before, bench */

'use strict';

var assert = require('assert');
var fs = require('fs');
var glob = require('glob');
var path = require('path');

var frontmatter = require('front-matter');
var fastmatter = require('..');

glob.sync(__dirname + '/fixtures/*.md').forEach(function(fixture) {

  suite(path.basename(fixture), function() {

    var str;

    set('iterations', 100);

    before(function(next) {
      fs.readFile(fixture, 'utf8', function(err, data) {
        if (err) throw err;
        str = data;
        assert.deepEqual(frontmatter(str), fastmatter(str)); // ensure parity
        next();
      });
    });

    bench('front-matter', function() {
      frontmatter(str);
    });

    bench('fastmatter', function() {
      fastmatter(str);
    });

  });

});
