const net = require('net')  

const [,,port] = process.argv
let date = new Date()
let myData = ''
const server = net.createServer(function (socket) {  
    function fill(elem) {
        return (elem < 10 ? '0' : '' ) + elem
    }
    let year = date.getFullYear()
    let month = fill(date.getMonth() +1)
    let day = fill(date.getDate())
    let hour =  fill(date.getHours())
    let min = fill(date.getMinutes())
    myData =  `${year}-${month}-${day} ${hour}:${min}\n`
   
    socket.end(myData)

})  
server.listen(port)  


// var net = require('net')
    
//     function zeroFill (i) {
//       return (i < 10 ? '0' : '') + i
//     }
    
//     function now () {
//       var d = new Date()
//       return d.getFullYear() + '-' +
//         zeroFill(d.getMonth() + 1) + '-' +
//         zeroFill(d.getDate()) + ' ' +
//         zeroFill(d.getHours()) + ':' +
//         zeroFill(d.getMinutes())
//     }
    
//     var server = net.createServer(function (socket) {
//       socket.end(now() + '\n')
//     })
    
//     server.listen(Number(process.argv[2]))