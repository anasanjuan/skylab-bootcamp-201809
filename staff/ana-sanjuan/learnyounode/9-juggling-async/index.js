const http = require('http')

const [,,...paths] = process.argv
let result = []
let count = 0

paths.forEach((path, index) => {
    http.get(path, response => { 
        let dataArr = ''
        response.setEncoding('utf8') 

        response.on("data", data => dataArr += data) 

        response.on("error", err => console.log(err) )
        
        response.on("end", () => {
            result[index] = dataArr

            count++

            if (count === paths.length) result.forEach(res => console.log(res))
        }) 

    }).on('error', console.error)

})
