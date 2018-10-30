// let result = 0;
// for (let i = 2; i < process.argv.length; i++){
//     result += Number(process.argv[i])
// }
// console.log(result)

const arg = process.argv.slice(2)

const res = arg.reduce((accum, val) => accum + Number(val), 0)

console.log(res)