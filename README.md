# Fastmatter.js [![npm Version](http://img.shields.io/npm/v/fastmatter.svg?style=flat)](https://www.npmjs.org/package/fastmatter) [![Build Status](https://img.shields.io/travis/yuanqing/fastmatter.svg?style=flat)](https://travis-ci.org/yuanqing/fastmatter) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/fastmatter.svg?style=flat)](https://coveralls.io/r/yuanqing/fastmatter)

> A faster frontmatter parser.

Fastmatter is faster than the [front-matter](https://github.com/jxson/front-matter) node module because [it does not use regular expressions](https://github.com/yuanqing/fastmatter/blob/master/index.js). (See [Benchmark](#benchmark).)

## Usage

Given a document `foo.md` containing YAML frontmatter and content:

```
---
title: Hello, World!
tags: [ foo, bar, baz ]
---
Lorem ipsum dolor sit amet consectetur adipisicing elit.
```

&hellip;we can parse it like so:

```js
'use strict';

var fastmatter = require('fastmatter');
var fs = require('fs');

fs.readFile('./foo.md', 'utf8', function(err, data) {
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

Fastmatter merely separates the YAML frontmatter from the document body. Actual parsing of the YAML is handled by [JS-YAML](https://github.com/nodeca/js-yaml).

## API

### fastmatter(str)

Parses `str`, and returns the parsed result.

- `str` contains the raw YAML frontmatter and the document body.

## Installation

Install via [npm](https://www.npmjs.org/package/fastmatter):

```bash
$ npm i --save fastmatter
```

## Benchmark

Run the [Matcha](https://github.com/logicalparadox/matcha) benchmark like so:

```bash
$ npm run bench
```

## License

[MIT license](https://github.com/yuanqing/fastmatter/blob/master/LICENSE)
