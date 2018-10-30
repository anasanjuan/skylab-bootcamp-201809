const http = require('http')
const bl = require('bl')
const [,,url] = process.argv

http.get(url, response => { 
    response.pipe(bl((err, data) => {
        if (err) {
            return console.error(err)
        }
        console.log(`${data.length}\n${data}`)
    }))

})