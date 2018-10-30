const fs = require('fs')

const [,,file] = process.argv

const buf = fs.readFileSync(file)

const newLine = buf.toString().split('\n')

//not recommened, difficult to read
//const lines = fs.readFileSync(file).toString().split('\n')

console.log(newLine.length -1)
