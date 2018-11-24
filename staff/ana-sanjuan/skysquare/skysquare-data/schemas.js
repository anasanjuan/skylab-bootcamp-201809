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
    followers: [{
        type: ObjectId,
        ref: 'User'
    }],
    following: [{
        type: ObjectId,
        ref: 'User'
    }],
    favourites : [{
        type: ObjectId,
        ref: 'Place'
    }],
    history : [{
        type: ObjectId,
        ref: 'Place'
    }],
    profilePicture : {
        type: ObjectId,
        ref: 'Picture'
    }

})

const Place = new Schema ({
    name : {
        type: String, 
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitud: {
        type: Number,
        required: true
    },
    address:{
        type: String, 
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    scoring: {
        type: Number,
    },
    scores: [{
        type: Number,
    }],
    breakfast: {
        type: String,
    },
    lunch: {
        type: String,
    },
    dinner: {
        type: String,
    },
    coffee: {
        type: String,
    },
    nigthLife: {
        type: String,
    },
    thingsToDo: {
        type: String,
    }
})

const Picture = new Schema({
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    placeId: {
        type: ObjectId,
        red: 'Place',
        required: true
    } 
})

const ProfilePicture = new Schema({
    url: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    
})
const Tip = new Schema({
    text: {
        type: String,
        required:true
    },
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    placeId: {
        type: ObjectId,
        red: 'Place'
    } 
})

module.exports = {
    User,
    Place,
    Picture,
    ProfilePicture,
    Tip
}