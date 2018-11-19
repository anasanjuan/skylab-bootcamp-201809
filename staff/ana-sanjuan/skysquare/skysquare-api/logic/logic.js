const { User } = require('../data')
const { AlreadyExistsError, AuthError } = require('../errors')
const validate = require('../utils/validate')


const logic = {
    registerUser(name, surname, email, password, birthday, gender, phone) {
        validate([
            { key: 'name', value: name, type: String },
            { key: 'surname', value: surname, type: String },
            { key: 'email', value: email, type: String },
            { key: 'password', value: password, type: String },
            { key: 'birthday', value: birthday, type: String },
            { key: 'gender', value: gender, type: String, optional: true },
            { key: 'phone', value: phone, type: String, optional: true }
        ])
        return (async () => {
            let user = await User.findOne({ email })

            if (user) throw new AlreadyExistsError(`user with email ${email} already exist`)

            user = new User({ name, surname, email, password, birthday })
            debugger
            gender != null && (user.gender = gender)
            phone != null && (user.phone = phone)

            await user.save()
        })()

    },
    authenticateUser(email, password) {
        validate([
            { key: 'email', value: email, type: String },
            { key: 'password', value: password, type: String },
        ])
        return (async () => {
            let user = await User.findOne({ email })

            if (user.password !== password) throw new AuthError(`incorrect user or password`)

            return user.id
        })()

    }
}

module.exports = logic