module.exports = function (directory, extension, callback) {

    const fs = require('fs')
    const path = require('path')
    
    fs.readdir(directory, (err, list) => {
        if (err) return callback(err)
   
        var rest = list.filter(file => path.extname(file) === (`.${extension}`)) 

        callback(null, rest)
    })
}

