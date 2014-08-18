# Fastmatter.js [![npm Version](http://img.shields.io/npm/v/fastmatter.svg?style=flat)](https://www.npmjs.org/package/fastmatter) [![Build Status](https://img.shields.io/travis/yuanqing/fastmatter.svg?style=flat)](https://travis-ci.org/yuanqing/fastmatter) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/fastmatter.svg?style=flat)](https://coveralls.io/r/yuanqing/fastmatter)

> A faster frontmatter parser.

(Faster relative to the [front-matter](https://github.com/jxson/front-matter) node module; see [Benchmark](#benchmark).)

## Usage

Given a document `foo.md`:

```md
---
title: Hello, World!
tags: [ foo, bar, baz ]
---
Lorem ipsum dolor sit amet consectetur adipisicing elit.
```

&hellip;we can parse it like so:

```js
fastmatter.parseFile('foo.md', function(err, parsed) {
  if (err) throw err;
  console.log(parsed);
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

Note that there is also a `parse` method that takes a `string` instead of a file path

## API

### fastmatter.parseFile(file, cb)

Parses the `file`.

- `file` is the path to a text document.

- The `parsed` result is returned via the `cb(err, parsed)` callback.

### fastmatter.parse(str)

Parses the `str` and returns the parsed result.

- `str` is raw text containing YAML frontmatter and the document body.

## Installation

Install via [npm](https://www.npmjs.org/package/fastmatter):

```bash
$ npm i --save fastmatter
```

## Benchmark

We compare Fastmatter (namely the `parse` method) against [front-matter](https://github.com/jxson/front-matter):

```bash
$ git clone https://github.com/yuanqing/fastmatter.git
$ cd fastmatter
$ npm install
$ ./node_modules/.bin/matcha
```

## License

[MIT license](https://github.com/yuanqing/fastmatter/blob/master/LICENSE)
