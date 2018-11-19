const mongoose = require('mongoose')
const { User } = require('../data')
const logic = require('./logic')
const { AlreadyExistsError, AuthError } = require('../errors')

const { expect } = require('chai')

const MONGO_URL = 'mongodb://localhost:27017/skysquare-test'

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {
    before(() => mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true }))

    beforeEach(() => User.deleteMany())

    describe('users', () => {
        describe('register', () => {
            let name, surname, email, password, birthday, gender, phone
            beforeEach(()=> {
                name= 'John'
                surname= 'Doe'
                email = `jd-${Math.random()}@example.com`
                password = `jd-${Math.random()}`
                birthday = '20/02/2002' 
                gender = 'Male'
                phone = `jdPhone-${Math.random()}`

            })
            it('should succed on correct data', async ()=> {
                const res = await logic.registerUser(name, surname, email, password, birthday, gender, phone)
                    
                expect(res).to.be.undefined

                let users = await User.find()

                expect(users.length).to.equal(1)

                let [user] = users

                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.email).to.equal(email)
                expect(user.password).to.equal(password)
                expect(user.birthday).to.equal(birthday)
                expect(user.gender).to.equal(gender)
                expect(user.phone).to.equal(phone)

            }) 
            it('should fail on undefined name', () => {
                expect(()=> {logic.registerUser(undefined, surname, email, password, birthday, gender, phone)}).to.throw(TypeError, 'undefined is not a string')
            })
            it('should succed on null gender', async() => {
                const res = await logic.registerUser(name, surname, email, password, birthday, null, phone)
                    
                expect(res).to.be.undefined

                let users = await User.find()

                expect(users.length).to.equal(1)

                let [user] = users

                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.email).to.equal(email)
                expect(user.password).to.equal(password)
                expect(user.birthday).to.equal(birthday)
                expect(user.gender).to.equal(undefined)
                expect(user.phone).to.equal(phone)            })
        })

        describe('log In', ()=> {
            let user
            beforeEach(()=> {
                name= 'John'
                surname= 'Doe'
                email = `jd-${Math.random()}@example.com`
                password = `jd-${Math.random()}`
                birthday = '20/02/2002' 
                gender = 'Male'
                phone = `jdPhone-${Math.random()}`

                user = new User({name, surname, email, password, birthday, gender, phone})

                return user.save()
            })
            it('should succed on correct data', async ()=> {
                const {email} = user
                let wrongPassword = `jd-${Math.random()}`

                try {
                    const id = await logic.authenticateUser(email, wrongPassword)
                } catch(error) {
                    expect(error).to.be.instanceof(AuthError)

                    expect(error.message).to.equal(`incorrect user or password`)
                }
            })

            it('should fail on undefined email', () => {
                expect(()=> {logic.registerUser(undefined, password)}).to.throw(TypeError, 'undefined is not a string')

            })
            it('should fail on undefined pasword', () => {
                expect(()=> {logic.registerUser(email, undefined)}).to.throw(TypeError, 'undefined is not a string')

            })
            
            

        })



    })
    after(() => mongoose.disconnect())
})