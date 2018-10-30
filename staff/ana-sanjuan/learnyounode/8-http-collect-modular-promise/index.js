
const httpGet = require('./http-get')
const [,,url] = process.argv

httpGet (url) 
    .then(data => {
        console.log(`${data.length}\n${data}`)
    })
    .catch(err => console.error(err))