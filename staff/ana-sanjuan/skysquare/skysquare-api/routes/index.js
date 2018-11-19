const express = require('express')
const bodyParser = require('body-parser')
const routeHandler = require('./route-handler')
const logic = require('../logic/logic')
const jwt = require('jsonwebtoken')

const router = express.Router()

const jsonBodyParser = bodyParser.json()

const { env: { JWT_SECRET } } = process


router.post('/users', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const {body: {name, surname, email, password, birthday, gender, phone}} = req

        return logic.registerUser(name, surname, email, password, birthday, gender? gender: null, phone? phone: null)
            .then(() => {
                res.status(201)
                res.json({
                    message: `${email} successfully registered`
                })
            })
    }, res)
})

router.post('/auth', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const {body: { email, password}} = req

        return logic.authenticateUser(email, password)
            .then(id => {
                const token = jwt.sign({sub: id}, JWT_SECRET)
                
                res.json({
                    data: {
                        id,
                        token
                    }
                })
            })
    }, res)
})

module.exports = router