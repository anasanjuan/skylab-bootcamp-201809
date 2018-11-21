const express = require('express')
const bodyParser = require('body-parser')
const routeHandler = require('./route-handler')
const logic = require('../logic/logic')
const jwt = require('jsonwebtoken')
const bearerTokenParser = require('../utils/bearer-token-parser')
const jwtVerifier = require('./jwt-verifier')


const router = express.Router()

const jsonBodyParser = bodyParser.json()

const { env: { JWT_SECRET } } = process

cloudinary.config({ 
    cloud_name: 'dhlt2azl4', 
    api_key: '534167988966151', 
    api_secret: 'CpjYh3OdFdUc8BVB2h1gCMyX1cE' 
})



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

router.post('/users/:id/places', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const {params: {id}, body:{ name ,latitude, longitud ,breakfast ,lunch ,dinner ,coffee ,nigthLife ,thingsToDo},sub} = req
        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addPlace(name ,latitude, longitud ,id ,breakfast ,lunch ,dinner ,coffee ,nigthLife ,thingsToDo) 
            .then(() =>
                res.json({
                    message: 'place added'
                })
            )
    }, res)
})


// //ADD PHOTO CLOUDINARY
// router.patch('/upload', jsonBodyParser, (req, res) => {
//     const {
//         body: { base64Image },
//     } = req;

//     return logic._saveImage(base64Image)
//         .then(photo => res.status(200).json({ status: 'OK', photo }))
//         .catch((err) => {
//             const { message } = err;
//             res.status(err instanceof LogicError ? 400 : 500).json({ message });
//         });
// });

module.exports = router