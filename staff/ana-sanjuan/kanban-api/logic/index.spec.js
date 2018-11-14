const mongoose = require('mongoose')
const { User, Postit } = require('../data')
const logic = require('.')
const { AlreadyExistsError } = require('../errors')

const { expect } = require('chai')

const MONGO_URL = 'mongodb://localhost:27017/postit-test'

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {

    before(() => mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true }))

    beforeEach(() => Promise.all([User.deleteMany(), Postit.deleteMany()]))

    beforeEach(() => Promise.all([User.deleteMany(), Postit.deleteMany()]))

    describe('user', () => {
        describe('register', () => {
            let name, surname, username, password

            beforeEach(() => {
                name = `name-${Math.random()}`
                surname = `surname-${Math.random()}`
                username = `username-${Math.random()}`
                password = `password-${Math.random()}`
            })

            it('should succeed on correct data', async () => {
                const res = await logic.registerUser(name, surname, username, password)

                expect(res).to.be.undefined

                const _users = await User.find()

                expect(_users.length).to.equal(1)

                const [user] = _users

                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.username).to.equal(username)
                expect(user.password).to.equal(password)
            })


            it('should fail on undefined name', () => {
                expect(() => logic.registerUser(undefined, surname, username, password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases
        })

        describe('authenticate', () => {
            let user

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                await user.save()
            })

            it('should authenticate on correct credentials', async () => {
                const { username, password } = user

                const id = await logic.authenticateUser(username, password)

                expect(id).to.exist
                expect(id).to.be.a('string')

                const _users = await User.find()

                const [_user] = _users

                expect(_user.id).to.equal(id)
            })



            it('should fail on undefined username', () => {
                expect(() => logic.authenticateUser(undefined, user.password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases
        })

        describe('retrieve', () => {
            let user

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                await user.save()
            })

            it('should succeed on valid id', async () => {
                const _user = await logic.retrieveUser(user.id)

                expect(_user).not.to.be.instanceof(User)

                const { id, name, surname, username, password, postits } = _user

                expect(id).to.exist
                expect(id).to.equal(user.id)
                expect(name).to.equal(user.name)
                expect(surname).to.equal(user.surname)
                expect(username).to.equal(user.username)
                expect(password).to.be.undefined
                expect(postits).not.to.exist
            })
        })

        describe('update', () => {
            let user

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                await user.save()
            })

            it('should update on correct data and password', async () => {
                const { id, name, surname, username, password } = user

                const newName = `${name}-${Math.random()}`
                const newSurname = `${surname}-${Math.random()}`
                const newUsername = `${username}-${Math.random()}`
                const newPassword = `${password}-${Math.random()}`

                const res = await logic.updateUser(id, newName, newSurname, newUsername, newPassword, password)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.id).to.equal(id)
                expect(_user.name).to.equal(newName)
                expect(_user.surname).to.equal(newSurname)
                expect(_user.username).to.equal(newUsername)
                expect(_user.password).to.equal(newPassword)
            })


            it('should update on correct id, name and password (other fields null)', async () => {
                const { id, name, surname, username, password } = user

                const newName = `${name}-${Math.random()}`

                const res = await logic.updateUser(id, newName, null, null, null, password)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.id).to.equal(id)
                expect(_user.name).to.equal(newName)
                expect(_user.surname).to.equal(surname)
                expect(_user.username).to.equal(username)
                expect(_user.password).to.equal(password)
            })

            it('should update on correct id, surname and password (other fields null)', async () => {
                const { id, name, surname, username, password } = user

                const newSurname = `${surname}-${Math.random()}`

                const res = await logic.updateUser(id, null, newSurname, null, null, password)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.id).to.equal(id)
                expect(_user.name).to.equal(name)
                expect(_user.surname).to.equal(newSurname)
                expect(_user.username).to.equal(username)
                expect(_user.password).to.equal(password)
            })


            // TODO other combinations of valid updates

            it('should fail on undefined id', () => {
                const { id, name, surname, username, password } = user

                expect(() => logic.updateUser(undefined, name, surname, username, password, password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases

            describe('with existing user', () => {
                let user2

                beforeEach(async () => {
                    user2 = new User({ name: 'John', surname: 'Doe', username: 'jd2', password: '123' })

                    await user2.save()
                })

                it('should update on correct data and password', async () => {
                    const { id, name, surname, username, password } = user2

                    const newUsername = 'jd'

                    try {
                        await logic.updateUser(id, null, null, newUsername, null, password)

                        expect(true).to.be.false
                    } catch (err) {
                        expect(err).to.be.instanceof(AlreadyExistsError)

                    } finally {
                        const _user = await User.findById(id)
                        expect(_user.id).to.equal(id)

                        expect(_user.name).to.equal(name)
                        expect(_user.surname).to.equal(surname)
                        expect(_user.username).to.equal(username)
                        expect(_user.password).to.equal(password)
                    }

                })

            })

        })

        describe('add buddies', () => {
            let user, buddy
            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                buddy = new User({ name: 'John2', surname: 'Doe2', username: 'jd2', password: '123' })

                await user.save()
                await buddy.save()
            })

            it('should succedd on correct data', async () => {
                await logic.addBuddy(user.id, buddy.username)

                const _user = await User.findById(user.id)

                expect(_user.buddies.length).to.equal(1)

                expect(_user.buddies[0]._id.toString()).to.equal(buddy.id)
            })

        })

        describe('list buddies', () => {
            let user, buddy1, buddy2
            beforeEach(async () => {

                buddy1 = new User({ name: 'John2', surname: 'Doe2', username: 'buddy1', password: '123' })
                buddy2 = new User({ name: 'John3', surname: 'Doe3', username: 'buddy2', password: '123' })

                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', buddies:[buddy1.id, buddy2.id] })
                
                await Promise.all([ buddy1.save(), buddy2.save()])
                await user.save()
            })
            it('should succed on correct data', async ()=> {
                const buddies = await logic.listBuddies(user.id)

                const _user = await User.findById(user.id)

                const {buddies: _buddies} = _user

                expect(buddies.length).to.equal(2)
                expect(buddies.length).to.equal(_buddies.length)

                const _buddy1 = await User.findById(_buddies[0]._id.toString())
                const _buddy2 = await User.findById(_buddies[1]._id.toString())
                
                expect(buddy1.username).to.equal(_buddy1.username)
                expect(buddy2.username).to.equal(_buddy2.username)
                
                const [__buddy1, __buddy2] = buddies
                debugger                

                expect(_buddy1.username).to.equal(__buddy1)
                expect(_buddy2.username).to.equal(__buddy2)
                
            })
        })

    })

    describe('postits', () => {
        describe('add', () => {
            let user, text, status

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                text = `text-${Math.random()}`

                status = "TODO"

                await user.save()
            })

            it('should succeed on correct data', async () => {
                const res = await logic.addPostit(user.id, text, status)
                
                expect(res).to.be.undefined

                const postits = await Postit.find()

                expect(postits.length).to.equal(1)

                const [postit] = postits

                expect(postit.text).to.equal(text)
            })


            // TODO other test cases
        })

        describe('list', () => {
            let user, postit, postit2

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                postit = new Postit({ text: 'hello text', status: "TODO", user: user.id })

                postit2 = new Postit({ text: 'hello text 2', status: "TODO", user: user.id })

                await user.save()
                await postit.save()
                await postit2.save()
            })

            it('should succeed on correct data', async () => {
                const postits = await logic.listPostits(user.id)
                const _postits = await Postit.find()

                expect(_postits.length).to.equal(2)

                expect(postits.length).to.equal(_postits.length)

                const [_postit, _postit2] = _postits

                expect(_postit.id).to.equal(postit.id)
                expect(_postit.text).to.equal(postit.text)

                expect(_postit2.id).to.equal(postit2.id)
                expect(_postit2.text).to.equal(postit2.text)

                const [__postit, __postit2] = postits

                expect(__postit).not.to.be.instanceof(Postit)
                expect(__postit2).not.to.be.instanceof(Postit)

                expect(_postit.id).to.equal(__postit.id)
                expect(_postit.text).to.equal(__postit.text)

                expect(_postit2.id).to.equal(__postit2.id)
                expect(_postit2.text).to.equal(__postit2.text)
            })
        })

        describe('list postit assigned to me', () => {
            let user, buddy1, postit
            beforeEach(async () => {

                buddy1 = new User({ name: 'John2', surname: 'Doe2', username: 'buddy1', password: '123' })
                buddy2 = new User({ name: 'John3', surname: 'Doe3', username: 'buddy2', password: '123' })

                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', buddies:[buddy1.id, buddy2.id] })
                
                postit = new Postit({ text: 'hello text', status: "TODO", user: user.id, assignTo: buddy1.id })


                await Promise.all([ buddy1.save(), buddy2.save()])
                await user.save()
                await postit.save()
            })

            it('should succed on correct data', async () => {
                const postits = await logic.listAssigToMe(id)

                const _postits = await Postit.findOne({assignTo: buddy.id })

                expect(_postits.length).to.equal(1)
                expect(postits.length).to.equal(_postits.length)

                const [_postit] = _postits

                expect(_postit.id).to.equal(postit.id)
                expect(_postit.text).to.equal(postit.text)

                const [__postit] = postits

                expect(__postit).not.to.be.instanceof(Postit)

                expect(_postit.id).to.equal(__postit.id)
                expect(_postit.text).to.equal(__postit.text)
            })
        })

        describe('remove', () => {
            let user, postit

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                postit = new Postit({ text: 'hello text', status: "TODO", user: user.id })

                await Promise.all([user.save(), postit.save()])

            })

            it('should succeed on correct data', async () => {
                const res = await logic.removePostit(user.id, postit.id)

                expect(res).to.be.undefined

                const postits = await Postit.find()

                expect(postits.length).to.equal(0)

            })
        })

        describe('modify text', () => {
            let user, postit, newText

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                postit = new Postit({ text: 'hello text', status: 'TODO', user: user.id })

                newText = `new-text-${Math.random()}`

                await user.save()
                await postit.save()
            })

            it('should succeed on correct data', async () => {
                const res = await logic.modifyPostit(user.id, postit.id, newText)
                
                expect(res).to.be.undefined

                const _postit = await Postit.findById(postit.id)

                expect(_postit.text).to.equal(newText)
            })
        })


        describe('modify status', () => {
            let user, postit, newStatus

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                postit = new Postit({ text: 'hello text', status: 'TODO', user: user.id })

                newStatus = 'REVIEW'

                await user.save()
                await postit.save()
            })

            it('should succeed on correct data', async () => {
                const res = await logic.modifyPostitStatus(user.id, postit.id, newStatus)
                
                expect(res).to.be.undefined

                const _postit = await Postit.findById(postit.id)

                expect(_postit.status).to.equal(newStatus)
            })
        })

        describe('assign postit to buddy', () => {
            let user, buddy, postit
            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                buddy = new User({ name: 'John2', surname: 'Doe2', username: 'buddy', password: '123' })

                postit = new Postit({ text: 'hello text', status: 'TODO', user: user.id })


                await user.save()
                await buddy.save()
                await postit.save()
            })

            it('should succed on correct data', async () => {
                const res = await logic.assignBuddy(user.id, buddy.username, postit.id)

                expect(res).to.be.undefined

                const _postit = await Postit.findById(postit.id)

                expect(_postit.assignTo.toString()).to.equal(buddy.id)

            })
        })
    })


    after(() => mongoose.disconnect())
})