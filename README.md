# fastmatter.js [![npm Version](http://img.shields.io/npm/v/fastmatter.svg?style=flat)](https://www.npmjs.org/package/fastmatter) [![Build Status](https://img.shields.io/travis/yuanqing/fastmatter.svg?branch=master&style=flat)](https://travis-ci.org/yuanqing/fastmatter) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/fastmatter.svg?style=flat)](https://coveralls.io/r/yuanqing/fastmatter)

> A faster frontmatter parser. Supports both string and stream inputs.

Fastmatter is faster than the [front-matter](https://github.com/jxson/front-matter) module because fastmatter [does not use regular expressions](index.js). (See [Benchmark](#benchmark).)

## Usage

Given a document `foo.md` containing YAML frontmatter and content:

```
---
title: Hello, World!
tags: [ foo, bar, baz ]
---
Lorem ipsum dolor sit amet consectetur adipisicing elit.
```

&hellip;we can parse this document as a string, via [`fastmatter(str)`](#fastmatterstr):

```js
'use strict';

var fastmatter = require('fastmatter');
var fs = require('fs');

fs.readFile('foo.md', 'utf8', function(err, data) {
  if (err) throw err;
  fastmatter(data);
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
```

&hellip;or as a stream, via [`fastmatter.stream([cb])`](#fastmatterstreamcb):

```js
'use strict';

var fastmatter = require('fastmatter');
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
```

`cb` is called with the frontmatter `attributes`, while the document `body` is simply passed through the stream. Also note that the `this` context of `cb` is the stream itself; this is useful if we want to change the flow of the stream depending on the parsed `attributes`.

## API

```js
var fastmatter = require('fastmatter');
```

### fastmatter(str)

Parses the `str` and returns the parsed frontmatter `attributes` and document `body`.

### fastmatter.stream([cb])

Calls `cb` with the parsed frontmatter `attributes`. The `this` context of `cb` is the stream itself. The document `body` is passed through the stream.

## Installation

Install via [npm](https://www.npmjs.org):

```
$ npm i --save fastmatter
```

## Benchmark

Run the [Matcha](https://github.com/logicalparadox/matcha) benchmarks like so:

```
$ npm run benchmark
```

Results (as of October 2015) [via Travis-CI](https://travis-ci.org/yuanqing/fastmatter/jobs/86626296):

```
     1-baseline.md
wait » front-matter             391 op/s » front-matter
wait » fastmatter          14,400 op/s » fastmatter

     2-more-frontmatter.md
wait » front-matter               3 op/s » front-matter
wait » fastmatter             176 op/s » fastmatter

     3-more-body.md
wait » front-matter             489 op/s » front-matter
wait » fastmatter           4,669 op/s » fastmatter

     4-more-frontmatter-and-body.md
wait » front-matter               3 op/s » front-matter
wait » fastmatter             199 op/s » fastmatter
```

## Changelog

- 1.1.0
  - Add `fastmatter.stream`
- 1.0.0
  - First stable release

## License

[MIT](LICENSE.md)
