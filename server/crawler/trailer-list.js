const puppeteer = require('puppeteer')
const url = `https://movie.douban.com/tag/%E7%A7%91%E5%B9%BB?start=20&type=R`

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

  ; (async () => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      dumpio: false
    });
    const page = await browser.newPage();
    console.log('Start visit the target page')
    await page.goto(url, {
      waitUntil: 'networkidle2'
    });
    await sleep(3000)


    await page.waitForSelector('.more')

    for (let i = 0; i < 5; i++) {
      await sleep(3000)
      await page.click('.more')
    }

    const result = await page.evaluate(() => {
      var $ = window.$
      var items = $('.item')
      var links = []

      if (items.length >= 1) {
        items.each((index, item) => {
          let it = $(item)
          let doubanId = it.find('.nbg').attr('href').split('subject/')[1].split('/')[0]
          let title = $(it.find('.pl2 a')[0]).text().replace(/\n/g, '').replace(/\r/g, '').replace(/\//g, '').trim()
          let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')
          let rate = Number(it.find('.rate').text())

          links.push({
            doubanId,
            title,
            rate,
            poster
          })
        })
      }

      return links
    })

    await browser.close();
    process.send({ result })
    process.exit(0)
  })();

