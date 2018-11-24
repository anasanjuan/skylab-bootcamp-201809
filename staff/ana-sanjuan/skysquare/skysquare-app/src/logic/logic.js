// require('dotenv').config()
// const { env: { URL } } = process
const validate = require('../utils/validate')

global.sessionStorage = require('sessionstorage')

const logic = {
    _userId: sessionStorage.getItem('userId') || null,
    _token: sessionStorage.getItem('token') || null,

    url: 'http://localhost:5000/api', //todo pasar a .env

    register(name, surname, email, password, birthday, gender, phone) {
        validate([
            { key: 'name', value: name, type: String },
            { key: 'surname', value: surname, type: String },
            { key: 'email', value: email, type: String },
            { key: 'password', value: password, type: String },
            { key: 'birthday', value: birthday, type: String },
            { key: 'gender', value: gender, type: String, optional: true },
            { key: 'phone', value: phone, type: String, optional: true }
        ])

        return fetch(`${this.url}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ name, surname, email, password, birthday, gender, phone })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    logIn(email, password) {
        validate([
            { key: 'email', value: email, type: String },
            { key: 'password', value: password, type: String },
        ])

        return fetch(`${this.url}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                const { id, token } = res.data

                this._userId = id
                this._token = token
                
                sessionStorage.setItem('userId', id)
                sessionStorage.setItem('token', token)
            })
    },
    
    retrieveUser() {
        return fetch(`${this.url}/users/${this._userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
        .then(res => {
            return res.json()
        })
        .then(res => {
            if (res.error) throw Error(res.error)

            return res.data
        })
    },
    
    get loggedIn() {
        return !!this._userId
    },

    logOut() {
        this._userId = null
        this._token = null

        sessionStorage.removeItem('userId')
        sessionStorage.removeItem('token')
    },

    AddPlace(name, address, latitude, longitud, breakfast, lunch, dinner, coffee, nightLife,thingsToDo) {
        validate([
            { key: 'name', value: name, type: String },
            { key: 'address', value: address, type: String },
            { key: 'latitude', value: latitude, type: Number },
            { key: 'longitud', value: longitud, type: Number },
            { key: 'breakfast', value: breakfast, type: String },
            { key: 'lunch', value: lunch, type: String },
            { key: 'dinner', value: dinner, type: String },
            { key: 'coffee', value: coffee, type: String },
            { key: 'nightLife', value: nightLife, type: String },
            { key: 'thingsToDo', value: thingsToDo, type: String }
        ])
        
        return fetch(`${this.url}/users/${this._userId}/places`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ name, address, latitude, longitud, breakfast, lunch, dinner, coffee, nightLife,thingsToDo })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    listPlacesByFilter(filter) {
        validate([
            { key: 'filter', value: filter, type: String },
        ])
       
        return fetch(`${this.url}/users/${this._userId}/places/filter/${filter}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
        .then(res => {
            return res.json()
        })
        .then(res => {
            if (res.error) throw Error(res.error)

            return res.data
        })
    },

    listPlacesByName(name) {
        validate([
            { key: 'name', value: name, type: String },
        ])
       
        return fetch(`${this.url}/users/${this._userId}/places/name/${name}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
        .then(res => {
            return res.json()
        })
        .then(res => {
            if (res.error) throw Error(res.error)
            return res.data
        })

    },

    retrievePlace(placeId) {
        validate([
            { key: 'placeId', value: placeId, type: String },
        ])
       
        return fetch(`${this.url}/users/${this._userId}/places/${placeId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
        .then(res => {
            return res.json()
        })
        .then(res => {
            if (res.error) throw Error(res.error)
            return res.data
        })

    },

    listPictures(placeId) {
        validate([
            { key: 'placeId', value: placeId, type: String },
        ])

        return fetch(`${this.url}/users/${this._userId}/places/${placeId}/pictures`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
        .then(res => {
            return res.json()
        })
        .then(res => {
            if (res.error) throw Error(res.error)
            return res.data
        })

    }

   
}

// export default logic
module.exports = logic