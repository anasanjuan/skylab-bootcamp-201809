
const httpGet = require('./http-get')
const [,,url] = process.argv

httpGet (url, (err, data) => {
    if (err) throw Error
    console.log(`${data.length}\n${data}`)
})