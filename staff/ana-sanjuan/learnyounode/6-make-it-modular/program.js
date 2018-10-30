
const filterExt = require('./module.js')

const [,, directory, extension] = process.argv

filterExt(directory, extension, (err, list) => {
    if (err) throw err
    list.forEach(file => console.log(file))
})