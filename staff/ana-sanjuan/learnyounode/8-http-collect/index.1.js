const http = require('http')

const [,,url] = process.argv

http.get(url, response => { 
    let dataArr = ''
    response.setEncoding('utf8') 

    response.on("data", data =>  dataArr += data) 

    response.on("error", console.error) 
    
    response.on("end", () => {
        console.log(dataArr.length)
        
        console.log(dataArr)
    }) 

}).on('error', console.error)




// var http = require('http')
// var bl = require('bl')

// http.get(process.argv[2], function (response) {
//   response.pipe(bl(function (err, data) {
//     if (err) {
//       return console.error(err)
//     }
//     data = data.toString()
//     console.log(data.length)
//     console.log(data)
//   }))
// })