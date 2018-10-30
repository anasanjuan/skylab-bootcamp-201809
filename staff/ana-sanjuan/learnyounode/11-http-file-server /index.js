const http = require('http')  
const fs = require('fs')
const [,,port, file] = process.argv
 
let server = http.createServer(function (req, res) {  
    let scr = fs.createReadStream(file) 
    scr.pipe(res) 
})  
server.listen(port)  



// var http = require('http')
//     var fs = require('fs')
    
//     var server = http.createServer(function (req, res) {
//       res.writeHead(200, { 'content-type': 'text/plain' })
    
//       fs.createReadStream(process.argv[3]).pipe(res)
//     })
    
//     server.listen(Number(process.argv[2]))