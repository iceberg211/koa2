module.exports = `
doctype html
html(lang="en")
  head
    title= pageTitle
    link(href='http://apps.bdimg.com/libs/bootstrap/3.3.4/css/bootstrap.min.css')
    script(src='http://apps.bdimg.com/libs/lodash/3.5.0/lodash.min.js')
  body
    h1 Pug - node template engine
    #container.col
      if youAreUsingPug
        p You are amazing
      else
        p Get on it!
        p.
        Pug is a terse and simple templating language with a
        strong focus on performance and powerful features.
        `

