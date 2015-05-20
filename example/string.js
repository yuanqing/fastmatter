'use strict';

var fastmatter = require('..');
var fs = require('fs');

fs.readFile('foo.md', 'utf8', function(err, data) {
  if (err) throw err;
  console.log(fastmatter(data));
  /* =>
   * {
   *   attributes: {
   *     title: 'Hello, World!',
   *     tags: [ 'foo', 'bar', 'baz' ]
   *   },
   *   body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
   * }
   */
});
