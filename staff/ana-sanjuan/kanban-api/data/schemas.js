const { Schema, SchemaTypes: {ObjectId} } = require('mongoose')

const Postit = new Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String, 
        required: true
    },
    status: {
        type: String,
        default: 'TODO',
        required: true,
        enum: ['TODO', 'DOING', 'REVIEW', 'DONE'],
        required: true
    },
    assignTo: {
        type: ObjectId,
        ref: 'User'
    }

})

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    buddies: [{
        type: ObjectId,
        ref: 'User'
    }]
})

module.exports = {
    Postit,
    User
}

