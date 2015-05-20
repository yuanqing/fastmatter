'use strict';

var fastmatter = require('..');
var fs = require('fs');
var concat = require('concat-stream');

fs.createReadStream('foo.md')
  .pipe(fastmatter.stream(function(attributes) {
    console.log(attributes);
    /* =>
     * {
     *   title: 'Hello, World!',
     *   tags: [ 'foo', 'bar', 'baz' ]
     * }
     */
    this.pipe(concat(function(body) {
      console.log(body.toString());
      //=> Lorem ipsum dolor sit amet consectetur adipisicing elit.
    }));
  }));
