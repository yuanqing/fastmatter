const fastmatter = require('..')
const fs = require('fs')
const concat = require('concat-stream')

fs.createReadStream('foo.md').pipe(
  fastmatter.stream(function (attributes) {
    console.log(attributes)
    /* =>
     * {
     *   title: 'Hello, World!',
     *   tags: [ 'foo', 'bar', 'baz' ]
     * }
     */
    this.pipe(
      concat(function (body) {
        console.log(body.toString())
        // => Lorem ipsum dolor sit amet consectetur adipisicing elit.
      })
    )
  })
)
