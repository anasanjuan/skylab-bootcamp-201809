const fs = require('fs')
const path = require('path')

fs.readdir(process.argv[2], function callback(err, list) {
    if (err) throw err
    list.forEach((item) => {
        if (path.extname(item) === ('.' + process.argv[3])) console.log(item)
    })
})