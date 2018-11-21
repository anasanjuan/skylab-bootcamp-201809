const mongoose = require('mongoose')

const {User, Place, Picture, Tip} = require('./schemas')

module.exports = {
    mongoose,
    models: {
        User: mongoose.model('User', User),
        Place: mongoose.model('Place', Place),
        Picture: mongoose.model('Picture', Picture),
        Tip: mongoose.model('Tip', Tip)
    }
}