const express = require('express')

const { argv: [, , port] } = process

const app = express()

const users = []

let loggedIn = null

app.get('/', (req, res) => {
    if(!loggedIn) {
    res.send(`<!DOCTYPE html>
<html>
    <head>
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <a href="/login">Login</a> or <a href="/register">Register</a>
    </body>
</html>`)
} else { res.redirect('/home')
}
})

app.get('/login', (req, res) => {
    if(!loggedIn) {
    res.send(`<!DOCTYPE html>
<html>
    <head>
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <form action="/home" method="POST">
            <input type="text" name="username" placeholder="username">
            <input type="password" name="password" placeholder="password">
            <button type="submit">Login</button>
        </form>
        <a href="/">go back</a>
    </body>
</html>`)
    } else { res.redirect('/home')
    }
})

app.get('/register', (req, res) => {
    if(!loggedIn) {
    res.send(`<!DOCTYPE html>
<html>
    <head>
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <form action="/register" method="POST">
            <input type="text" name="name" placeholder="Name">
            <input type="text" name="surname" placeholder="Surname">
            <input type="text" name="username" placeholder="username">
            <input type="password" name="password" placeholder="password">
            <button type="submit">Register</button>
        </form>
        <a href="/">go back</a>
    </body>
</html>`)
} else { res.redirect('/home')
}
})

app.post('/register', (req, res) => {
    if(!loggedIn) {

    let data = ''

    req.on('data', chunk => data += chunk)

    req.on('end', () => {
        const keyValues = data.split('&')

        const user = { id: Date.now() }

        keyValues.forEach(keyValue => {
            const [key, value] = keyValue.split('=')

            user[key] = value
        })

        users.push(user)

        res.send(`<!DOCTYPE html>
<html>
    <head>
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <p>Ok! user ${user.name} registered.
        <a href="/">go back</a>
    </body>
</html>`)
    })
} else { res.redirect('/home')
}
})

app.all('/home', (req, res) => {

    let data = ''

    req.on('data', chunk => data += chunk)

    req.on('end', () => {
        const keyValues = data.split('&')

        const logged = {}
        keyValues.forEach(keyValue => {
            const [key, value] = keyValue.split('=')

            logged[key] = value
        })

        const user = users.filter(user => user.username === logged.username && user.password === logged.password)
        
    
        if (user.length !== 0) {
            loggedIn = user
            res.send(`<!DOCTYPE html>
 <html>
    <head>
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <p>Welcome ${loggedIn[0].name}. </p>
        <a href=“/logout”>logout</a>
    </body>
 </html>`)
        } else { 
            res.redirect('/')
        }
    })
})


app.get('/logout', (req, res) => {
    loggedIn = null
    debugger
    res.redirect('/')
 
})


app.get('/users', (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
    <head>
        <title>Hello World!</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <ul>
            ${users.map(user => `<li>${user.id} ${user.name} ${user.surname}</li>`).join('')}
        </ul>
        <a href="/">go back</a>
    </body>
</html>`)

})

app.listen(port || 3000)