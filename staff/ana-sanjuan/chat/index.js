const net = require('net')

const [,,port] = process.argv
var clients = []
const server = net.createServer(socket => {
    clients.push(socket)
    clients.forEach( soc => {
    soc.on('data', data => process.stdout.write(data))
    
    process.stdin.on('data', data => soc.write(data))
    })
})

server.listen(port)