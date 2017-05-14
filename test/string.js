const test = require('tape')

const fastmatter = require('../')
const fixtures = require('./fixtures')

test('throws if `string` is not a String', function (t) {
  t.plan(2)
  t.throws(function () {
    fastmatter()
  })
  t.throws(function () {
    fastmatter({})
  })
})

Object.keys(fixtures).forEach(function (key) {
  test(key, function (t) {
    const testCases = fixtures[key]
    t.plan(testCases.length)
    testCases.forEach(function (testCase) {
      t.looseEqual(fastmatter(testCase.input), testCase.output)
    })
  })
})
