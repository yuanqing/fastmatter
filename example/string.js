const fastmatter = require('..')
const fs = require('fs')

fs.readFile('foo.md', 'utf8', function (error, data) {
  if (error) {
    throw err
  }
  console.log(fastmatter(data))
  /* =>
   * {
   *   attributes: {
   *     title: 'Hello, World!',
   *     tags: [ 'foo', 'bar', 'baz' ]
   *   },
   *   body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
   * }
   */
})
