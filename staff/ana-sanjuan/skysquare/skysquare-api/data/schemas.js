const {Schema, SchemaTypes: { ObjectId }} = require('mongoose')

const User = new Schema ({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    birthday:{
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    phone: {
        type: String
    },
    followed: [{
        type: ObjectId,
        ref: 'User'
    }],
    following: [{
        type: ObjectId,
        ref: 'User'
    }],
    favourites : [{
        type: ObjectId,
        ref: 'Restaurant'
    }],
    history : [{
        type: ObjectId,
        ref: 'Restaurant'
    }]

})

const Restaurant = new Schema ({
    name : [{
        type: String, 
        required: true
    }],
    location: [{
        type: Number,
        required: true
    }],
    user: [{
        type: ObjectId,
        ref: 'User'
    }],
    scoring: [{
        type: Number,
        required: true
    }],
    breakfast: [{
        type: Boolean,
    }],
    lunch: [{
        type: Boolean,
    }],
    dinner: [{
        type: Boolean,
    }],
    coffee: [{
        type: Boolean,
    }],
    nigthLife: [{
        type: Boolean,
    }],
    toDo: [{
        type: Boolean,
    }]
})

const Picture = new Schema({
    url: [{
        type: String,
        required: true
    }],
    user: [{
        type: ObjectId,
        ref: 'User'
    }],
    restaurant: [{
        type: ObjectId,
        red: 'Restaurant'
    }] 
})

const Comment = new Schema({
    text: {
        type: String,
        required:true
    },
    user: [{
        type: ObjectId,
        ref: 'User'
    }],
    restaurant: [{
        type: ObjectId,
        red: 'Restaurant'
    }] 
})

module.exports = {
    User,
    Restaurant,
    Picture,
    Comment
}