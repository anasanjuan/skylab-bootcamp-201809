// import logic from './logic'

require('isomorphic-fetch')

global.sessionStorage = require('sessionstorage')

const logic = require('./logic')

logic.url = 'http://localhost:5000/api'
// logic.url = 'http://192.168.0.82:5000' // DEV server!

const { expect } = require('chai')

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {
    describe('users', () => {
        describe('register', () => {
            it('should succeed on correct data', () =>
                logic.registerUser('John', 'Doe', `jd-${Math.random()}`, '123')
                    .then(() => expect(true).to.be.true)
            )

            it('should fail on trying to register twice same user', () => {
                const username = `jd-${Math.random()}`

                return logic.registerUser('John', 'Doe', username, '123')
                    .then(() => logic.registerUser('John', 'Doe', username, '123'))
                    .catch(err => {
                        expect(err).not.to.be.undefined
                        expect(err.message).to.equal(`username ${username} already registered`)
                    })
            })

            it('should fail on undefined name', () => {
                expect(() =>
                    logic.registerUser(undefined, 'Doe', 'jd', '123')
                ).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other cases
        })

        describe('login', () => {
            describe('with existing user', () => {
                let username, password

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    return logic.registerUser(name, surname, username, password)
                })

                it('should succeed on correct data', () =>
                    logic.login(username, password)
                        .then(() => expect(true).to.be.true)
                )

                it('should fail on wrong username', () => {
                    username = `dummy-${Math.random()}`

                    return logic.login(username, password)
                        .catch(err => {
                            expect(err).not.to.be.undefined
                            expect(err.message).to.equal(`invalid username or password`)
                        })
                })

                it('should fail on wrong password', () => {
                    password = 'pepito'

                    return logic.login(username, password)
                        .catch(err => {
                            expect(err).not.to.be.undefined
                            expect(err.message).to.equal('invalid username or password')
                        })
                })
            })

            it('should fail on undefined username', () => {
                const username = undefined

                expect(() =>
                    logic.login(username, '123')
                ).to.throw(Error, `${username} is not a string`)
            })

            it('should fail on boolean username', () => {
                const username = true

                expect(() =>
                    logic.login(username, '123')
                ).to.throw(Error, `${username} is not a string`)
            })

            it('should fail on numeric username', () => {
                const username = 123

                expect(() =>
                    logic.login(username, '123')
                ).to.throw(Error, `${username} is not a string`)
            })

            // TODO other cases
        })

        describe('should add buddy', () => {
            let buddyUsername
            beforeEach(() => {
                const name = 'John', surname = 'Doe'

                const username = `jd-${Math.random()}`
                const password = `123-${Math.random()}`

                return logic.registerUser(name, surname, username, password)
                    .then(() => {
                        const buddyName = 'John2', buddySurname = 'Doe2'

                        buddyUsername = `jd2-${Math.random()}`

                        const buddyPassword = `123-${Math.random()}`

                        return logic.registerUser(buddyName, buddySurname, buddyUsername, buddyPassword)
                    })
            })

            it('should succed on correct data', () => {
                return logic.addBuddy(buddyUsername)
                    .then(() => expect(true).to.be.true)

            })

        })
    })

    describe('postits', () => {
        describe('add', () => {
            describe('with existing user', () => {
                let username, password, text, status

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    text = `hello ${Math.random()}`
                    status = 'TODO'

                    return logic.registerUser(name, surname, username, password)
                        .then(() => logic.login(username, password))
                })

                it('should succeed on correct data', () =>
                    logic.addPostit(text, status)
                        .then(() => expect(true).to.be.true)
                )
            })
        })

        describe('list', () => {
            describe('with existing user', () => {
                let username, password, text

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    text = `hello ${Math.random()}`
                    status = 'TODO'

                    return logic.registerUser(name, surname, username, password)
                        .then(() => logic.login(username, password))
                })

                describe('with existing postit', () => {
                    beforeEach(() => logic.addPostit(text, status))

                    it('should return postits', () =>
                        logic.listPostits()
                            .then(postits => {
                                expect(postits).not.to.be.undefined
                                expect(postits.length).to.equal(1)
                            })
                    )
                })

                it('should return no postits', () =>
                    logic.listPostits()
                        .then(postits => {
                            expect(postits).not.to.be.undefined
                            expect(postits.length).to.equal(0)
                        })
                )
            })
        })

        describe('remove', () => {
            describe('with existing user', () => {
                let username, password, text, postitId

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    text = `hello ${Math.random()}`
                    status = 'TODO'

                    return logic.registerUser(name, surname, username, password)
                        .then(() => logic.login(username, password))
                })

                describe('with existing postit', () => {
                    beforeEach(() =>
                        logic.addPostit(text, status)
                            .then(() => logic.listPostits())
                            .then(postits => postitId = postits[0].id)
                    )

                    it('should succeed', () =>
                        logic.removePostit(postitId)
                            .then(() => expect(true).to.be.true)
                    )
                })
            })
        })

        describe('modify', () => {
            describe('with existing user', () => {
                let username, password, postitId

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    return logic.registerUser(name, surname, username, password)
                        .then(() => logic.login(username, password))
                })

                describe('with existing postit', () => {
                    let text, status, newStatus

                    beforeEach(() => {
                        text = `hello ${Math.random()}`
                        status = 'TODO'
                        newStatus = 'REVIEW'

                        return logic.addPostit(text, status)
                            .then(() => logic.listPostits())
                            .then(([postit]) => postitId = postit.id)
                    })

                    it('should succeed', () =>
                        logic.modifyPostit(postitId, text, newStatus)
                            .then(() => {
                                expect(true).to.be.true

                                return logic.listPostits()
                            })
                            .then(postits => {
                                expect(postits).not.to.be.undefined
                                expect(postits.length).to.equal(1)

                                const [postit] = postits

                                expect(postit.id).to.equal(postitId)
                                expect(postit.text).to.equal(text)
                            })
                    )
                })
            })
        })

        describe('modify status', () => {
            describe('with existing user', () => {
                let username, password, text, postitId

                beforeEach(() => {
                    const name = 'John', surname = 'Doe'

                    username = `jd-${Math.random()}`
                    password = `123-${Math.random()}`

                    text = `hello ${Math.random()}`

                    return logic.registerUser(name, surname, username, password)
                        .then(() => logic.login(username, password))
                })

                describe('with existing postit', () => {
                    let status

                    beforeEach(() => {
                        status = `hello ${Math.random()}`

                        status = "DOING"

                        return logic.addPostit(text, "TODO")
                            .then(() => logic.listPostits())
                            .then(([postit]) => postitId = postit.id)
                    })

                    it('should succeed', () =>
                        logic.modifyPostitStatus(postitId, status)
                            .then(() => {
                                expect(true).to.be.true

                                return logic.listPostits()
                            })
                            .then(postits => {
                                expect(postits).not.to.be.undefined
                                expect(postits.length).to.equal(1)

                                const [postit] = postits

                                expect(postit.id).to.equal(postitId)
                                expect(postit.status).to.equal(status)
                            })
                    )
                })

            })
        })

        describe('should assign a buddy', () => {
            let buddyUsername, postitId
            beforeEach(() => {
                const name = 'John', surname = 'Doe'

                const username = `jd-${Math.random()}`
                const password = `123-${Math.random()}`

                return logic.registerUser(name, surname, username, password)
                    .then(() => {
                        const buddyName = 'John2', buddySurname = 'Doe2'

                        buddyUsername = `jd2-${Math.random()}`
                        const buddyPassword = `123-${Math.random()}`

                        return logic.registerUser(buddyName, buddySurname, buddyUsername, buddyPassword)

                    })
                    .then(() => {
                        const text = 'hola mundo'

                        const status = 'TODO'

                        return logic.addPostit(text, status)
                        .then(() => logic.listPostits())
                        .then(([postit]) => postitId = postit.id)
                    })
            })

            it('should succedd on correct data', () => {
                return logic.assignBuddy(buddyUsername, postitId)
                    .then(() => expect(true).to.be.true)

            })
        })
    })
})