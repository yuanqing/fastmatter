const Benchmark = require('benchmark')
const frontmatter = require('front-matter')
const fs = require('fs')
const glob = require('glob')
const path = require('path')
const yamlFrontMatter = require('yaml-front-matter').loadFront

const fastmatter = require('..')

glob.sync(path.join(__dirname, 'fixtures', '*.md')).forEach(function (fixture) {
  const string = fs.readFileSync(fixture, 'utf8')
  const suite = new Benchmark.Suite()
  suite
    .add('fastmatter', function () {
      fastmatter(string)
    })
    .add('frontmatter', function () {
      frontmatter(string)
    })
    .add('yamlFrontMatter', function () {
      yamlFrontMatter(string)
    })
    .on('complete', function () {
      console.log('Fastest is ' + this.filter('fastest').map('name'))
    })
    .run({ async: true })
})
