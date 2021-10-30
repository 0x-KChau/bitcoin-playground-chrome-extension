const Crawler = require('crawler')

export const crawler = new Crawler({
  maxConnections: 10,
  // This will be called for each crawled page
  callback: function (error: Error, res: any, done: Function) {
    if (error) {
      console.error(error)
    } else {
      const $ = res.$
      // $ is Cheerio by default
      // a lean implementation of core jQuery designed specifically for the server
      const transactions = $('span').text().match(/transacted(.*)times/ig)?.[0]
      const times = parseInt(transactions.split('').filter((f: string) => f.match(/\d/g)))
      return times > 0
    }
    done()
  }
})
