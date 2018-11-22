const validate = require('../utils/validate')

global.sessionStorage = require('sessionstorage')

const logic = {
    _userId: sessionStorage.getItem('userId') || null,
    _token: sessionStorage.getItem('token') || null,

    url: 'http://localhost:5000/api',

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

    
    get loggedIn() {
        return !!this._userId
    },

    logOut() {
        this._userId = null
        this._token = null

        sessionStorage.removeItem('userId')
        sessionStorage.removeItem('token')
    },

    listPlaces(filter) {
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

   
}

// export default logic
module.exports = logic