const mongoose = require('mongoose')

const {User, Restaurant, Picture, Comment} = require('./schemas')

module.exports = {
    User: mongoose.model('User', User),
    Restaurant: mongoose.model('Restaurant', Restaurant),
    Picture: mongoose.model('Picture', Picture),
    Comment: mongoose.model('Comment', Comment)

}