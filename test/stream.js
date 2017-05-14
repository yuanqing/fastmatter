const test = require('tape')
const concat = require('concat-stream')
const Readable = require('stream').Readable

const fastmatter = require('../')
const fixtures = require('./fixtures')

test('can be called without a `callback`', function (t) {
  t.plan(1)
  const rs = new Readable()
  rs.push('')
  rs.push(null)
  rs.pipe(fastmatter.stream()).pipe(
    concat(function (body) {
      t.equal(body.toString(), '')
    })
  )
})

Object.keys(fixtures).forEach(function (key) {
  test(key, function (t) {
    const testCases = fixtures[key]
    t.plan(testCases.length)
    testCases.forEach(function (testCase) {
      const rs = new Readable()
      rs.push(testCase.input)
      rs.push(null)
      rs.pipe(
        fastmatter.stream(function (attributes) {
          this.pipe(
            concat(function (body) {
              t.looseEqual(
                {
                  attributes: attributes,
                  body: body.toString()
                },
                testCase.output
              )
            })
          )
        })
      )
    })
  })
})
