const mongoose = require('mongoose')

const {User, Place, Picture,ProfilePicture, Tip} = require('./schemas')

module.exports = {
    mongoose,
    models: {
        User: mongoose.model('User', User),
        Place: mongoose.model('Place', Place),
        Picture: mongoose.model('Picture', Picture),
        ProfilePicture: mongoose.model('ProfilePicture', ProfilePicture),
        Tip: mongoose.model('Tip', Tip)
    }
}