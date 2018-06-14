const puppeteer = require('puppeteer')
const url = `https://movie.douban.com/subject/`
const doubanId = 4920389
const videoUrl = 'https://movie.douban.com/trailer/229187/#content'

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

  ; (async () => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      dumpio: false
    });
    const page = await browser.newPage();

    await page.goto(url + doubanId, {
      waitUntil: 'networkidle2'
    });

    await sleep(1000)

    const result = await page.evaluate(() => {
      var $ = window.$
      var it = $('.related-pic-video')

      if (it && it.length > 0) {
        var link = it.attr('href')
        var cover = it.css("background-image").split("\"")[1].slice(0, -1)

        return {
          link,
          cover
        }
      }

      return {}
    })
    let video
    // 详情页面说明有预告片地址
    if (result.link) {
      await page.goto(result.link, {
        waitUntil: 'networkidle2'
      })
      await sleep(1000)

      video = await page.evaluate(() => {
        var $ = window.$
        var it = $('source')

        if (it && it.length > 0) {
          return it.attr('src')
        }

        return ''
      })
    }

    const data = {
      video,
      doubanId,
      cover: result.cover
    }

    process.send(data)
    await browser.close();
  })();

