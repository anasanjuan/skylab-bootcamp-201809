const { mongoose, models: { User, Place, Picture, Tip } } = require('skysquare-data')
const logic = require('./logic')
const { AlreadyExistsError, AuthError, ValueError, NotFoundError } = require('../errors')
const fs = require('fs')

const { expect } = require('chai')

const MONGO_URL = 'mongodb://localhost:27017/skysquare-test'

var cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: 'dancing890',
    api_key: '534167988966151',
    api_secret: 'CpjYh3OdFdUc8BVB2h1gCMyX1cE'
})
// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {
    before(() => mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true }))

    beforeEach(() => Promise.all([User.deleteMany(), Place.deleteMany(), Picture.deleteMany(), Tip.deleteMany()]))


    describe('users', () => {
        describe('register User', () => {
            let name, surname, email, password, birthday, gender, phone
            beforeEach(() => {
                name = 'John'
                surname = 'Doe'
                email = `jd-${Math.random()}@example.com`
                password = `jd-${Math.random()}`
                birthday = '20/02/2002'
                gender = 'Male'
                phone = `jdPhone-${Math.random()}`

            })
            it('should succed on correct data', async () => {
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

            it('should fail on already exist user', async () => {
                const user = new User({ name, surname, email, password, birthday, gender, phone })

                await user.save()

                _name = 'Ada'
                _surname = 'Lovelace'
                _password = `ad-${Math.random()}`
                _birthday = '10/12/1815'
                _gender = 'Female'
                _phone = `adPhone-${Math.random()}`

                try {
                    await logic.registerUser(_name, _surname, email, _password, _birthday, _gender, _phone)
                    expect(true).to.be.false
                } catch (error) {
                    expect(error).to.be.instanceof(AlreadyExistsError)
                    expect(error.message).to.equal(`user with email ${email} already exist`)
                }

            })

            it('should fail on undefined name', () => {
                expect(() => { logic.registerUser(undefined, surname, email, password, birthday, gender, phone) }).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on undefined surname', () => {
                expect(() => { logic.registerUser(name, undefined, email, password, birthday, gender, phone) }).to.throw(TypeError, 'undefined is not a string')
            })
            it('should fail on undefined email', () => {
                expect(() => { logic.registerUser(name, surname, undefined, password, birthday, gender, phone) }).to.throw(TypeError, 'undefined is not a string')
            })
            it('should fail on undefined password', () => {
                expect(() => { logic.registerUser(name, surname, email, undefined, birthday, gender, phone) }).to.throw(TypeError, 'undefined is not a string')
            })
            it('should fail on undefined birthday', () => {
                expect(() => { logic.registerUser(name, surname, email, password, undefined, gender, phone) }).to.throw(TypeError, 'undefined is not a string')
            })
            it('should succed on undefined gender', async () => {

                const res = await logic.registerUser(name, surname, email, password, birthday, undefined, phone)

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
                expect(user.phone).to.equal(phone)

            })

            it('should succed on undefined gender', async () => {

                const res = await logic.registerUser(name, surname, email, password, birthday, gender, undefined)

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
                expect(user.phone).to.equal(undefined)

            })
            it('should succed on null gender', async () => {
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
                expect(user.phone).to.equal(phone)
            })

            it('should succed on null phone', async () => {
                const res = await logic.registerUser(name, surname, email, password, birthday, gender, null)

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
                expect(user.phone).to.equal(undefined)
            })


            it('should fail on empty name', () => {
                expect(() => { logic.registerUser('', surname, email, password, birthday, gender, phone) }).to.throw(ValueError, `name is empty or blank`)
            })

            it('should fail on empty surname', () => {
                expect(() => { logic.registerUser(name, '', email, password, birthday, gender, phone) }).to.throw(ValueError, `surname is empty or blank`)
            })
            it('should fail on empty email', () => {
                expect(() => { logic.registerUser(name, surname, '', password, birthday, gender, phone) }).to.throw(ValueError, `email is empty or blank`)
            })
            it('should fail on empty password', () => {
                expect(() => { logic.registerUser(name, surname, email, '', birthday, gender, phone) }).to.throw(ValueError, `password is empty or blank`)
            })
            it('should fail on empty birthday', () => {
                expect(() => { logic.registerUser(name, surname, email, password, '', gender, phone) }).to.throw(ValueError, `birthday is empty or blank`)
            })


            it('should fail on blank name', () => {
                expect(() => { logic.registerUser('     ', surname, email, password, birthday, gender, phone) }).to.throw(ValueError, `name is empty or blank`)
            })

            it('should fail on blank surname', () => {
                expect(() => { logic.registerUser(name, '       ', email, password, birthday, gender, phone) }).to.throw(ValueError, `surname is empty or blank`)
            })
            it('should fail on blank email', () => {
                expect(() => { logic.registerUser(name, surname, '      ', password, birthday, gender, phone) }).to.throw(ValueError, `email is empty or blank`)
            })
            it('should fail on blank password', () => {
                expect(() => { logic.registerUser(name, surname, email, '       ', birthday, gender, phone) }).to.throw(ValueError, `password is empty or blank`)
            })
            it('should fail on blank birthday', () => {
                expect(() => { logic.registerUser(name, surname, email, password, '     ', gender, phone) }).to.throw(ValueError, `birthday is empty or blank`)
            })


            it('should fail on non-string name(object)', () => {
                expect(() => { logic.registerUser({ name }, surname, email, password, birthday, gender, phone) }).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string surname(object)', () => {
                expect(() => { logic.registerUser(name, { surname }, email, password, birthday, gender, phone) }).to.throw(TypeError, '[object Object] is not a string')
            })
            it('should fail on non-string email(object)', () => {
                expect(() => { logic.registerUser(name, surname, { email }, password, birthday, gender, phone) }).to.throw(TypeError, '[object Object] is not a string')
            })
            it('should fail on non-string password(object)', () => {
                expect(() => { logic.registerUser(name, surname, email, { password }, birthday, gender, phone) }).to.throw(TypeError, '[object Object] is not a string')
            })
            it('should fail on non-string birthday(object)', () => {
                expect(() => { logic.registerUser(name, surname, email, password, { birthday }, gender, phone) }).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on non-string gender(object)', () => {
                expect(() => { logic.registerUser(name, surname, email, password, birthday, { gender }, phone) }).to.throw(TypeError, '[object Object] is not a string')
            })
            it('should fail on non-string phone(object)', () => {
                expect(() => { logic.registerUser(name, surname, email, password, birthday, gender, { phone }) }).to.throw(TypeError, '[object Object] is not a string')
            })




            it('should fail on non-string name(boolean)', () => {
                expect(() => { logic.registerUser(true, surname, email, password, birthday, gender, phone) }).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string surname(boolean)', () => {
                expect(() => { logic.registerUser(name, true, email, password, birthday, gender, phone) }).to.throw(TypeError, 'true is not a string')
            })
            it('should fail on non-string email(boolean)', () => {
                expect(() => { logic.registerUser(name, surname, true, password, birthday, gender, phone) }).to.throw(TypeError, 'true is not a string')
            })
            it('should fail on non-string password(boolean)', () => {
                expect(() => { logic.registerUser(name, surname, email, true, birthday, gender, phone) }).to.throw(TypeError, 'true is not a string')
            })
            it('should fail on non-string birthday(boolean)', () => {
                expect(() => { logic.registerUser(name, surname, email, password, true, gender, phone) }).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on non-string gender(boolean)', () => {
                expect(() => { logic.registerUser(name, surname, email, password, birthday, true, phone) }).to.throw(TypeError, 'true is not a string')
            })
            it('should fail on non-string phone(boolean)', () => {
                expect(() => { logic.registerUser(name, surname, email, password, birthday, gender, true) }).to.throw(TypeError, 'true is not a string')
            })





            it('should fail on non-string name(array)', () => {
                expect(() => { logic.registerUser([], surname, email, password, birthday, gender, phone) }).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string surname(array)', () => {
                expect(() => { logic.registerUser(name, [], email, password, birthday, gender, phone) }).to.throw(TypeError, ' is not a string')
            })
            it('should fail on non-string email(array)', () => {
                expect(() => { logic.registerUser(name, surname, [], password, birthday, gender, phone) }).to.throw(TypeError, ' is not a string')
            })
            it('should fail on non-string password(array)', () => {
                expect(() => { logic.registerUser(name, surname, email, [], birthday, gender, phone) }).to.throw(TypeError, ' is not a string')
            })
            it('should fail on non-string birthday(array)', () => {
                expect(() => { logic.registerUser(name, surname, email, password, [], gender, phone) }).to.throw(TypeError, ' is not a string')
            })

            it('should fail on non-string gender(array)', () => {
                expect(() => { logic.registerUser(name, surname, email, password, birthday, [], phone) }).to.throw(TypeError, ' is not a string')
            })
            it('should fail on non-string phone(array)', () => {
                expect(() => { logic.registerUser(name, surname, email, password, birthday, gender, []) }).to.throw(TypeError, ' is not a string')
            })




            it('should fail on non-string name(number)', () => {
                let number = Math.random()

                expect(() => { logic.registerUser(number, surname, email, password, birthday, gender, phone) }).to.throw(TypeError, `${number} is not a string`)
            })

            it('should fail on non-string surname(number)', () => {
                let number = Math.random()

                expect(() => { logic.registerUser(name, number, email, password, birthday, gender, phone) }).to.throw(TypeError, `${number} is not a string`)
            })
            it('should fail on non-string email(number)', () => {
                let number = Math.random()

                expect(() => { logic.registerUser(name, surname, number, password, birthday, gender, phone) }).to.throw(TypeError, `${number} is not a string`)
            })
            it('should fail on non-string password(number)', () => {
                let number = Math.random()

                expect(() => { logic.registerUser(name, surname, email, number, birthday, gender, phone) }).to.throw(TypeError, `${number} is not a string`)
            })
            it('should fail on non-string birthday(number)', () => {
                let number = Math.random()

                expect(() => { logic.registerUser(name, surname, email, password, number, gender, phone) }).to.throw(TypeError, `${number} is not a string`)
            })

            it('should fail on non-string gender(number)', () => {
                let number = Math.random()

                expect(() => { logic.registerUser(name, surname, email, password, birthday, number, phone) }).to.throw(TypeError, `${number} is not a string`)
            })
            it('should fail on non-string phone(number)', () => {
                let number = Math.random()

                expect(() => { logic.registerUser(name, surname, email, password, birthday, gender, number) }).to.throw(TypeError, `${number} is not a string`)
            })
        })

        describe('log In', () => {
            let user
            beforeEach(() => {
                name = 'John'
                surname = 'Doe'
                email = `jd-${Math.random()}@example.com`
                password = `jd-${Math.random()}`
                birthday = '20/02/2002'
                gender = 'Male'
                phone = `jdPhone-${Math.random()}`

                user = new User({ name, surname, email, password, birthday, gender, phone })

                return user.save()
            })
            it('should succed on correct data', async () => {
                const { email, password } = user

                const id = await logic.authenticateUser(email, password)

                expect(id).to.be.a('string')
                expect(id).to.be.equal(user.id)

            })

            it('should fail on non existing user', async () => {
                const email = `al-${Math.random()}@example.com`
                const { password } = user

                try {
                    const id = await logic.authenticateUser(email, password)
                    expect(true).to.be.false
                } catch (error) {
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`user with email ${email} not found`)
                }
            })

            it('should fail on incorrect password ', async () => {
                const { email } = user
                let wrongPassword = `al-${Math.random()}`

                try {
                    const id = await logic.authenticateUser(email, wrongPassword)
                    expect(true).to.be.false
                } catch (error) {
                    expect(error).to.be.instanceof(AuthError)

                    expect(error.message).to.equal(`incorrect user or password`)
                }
            })

            it('should fail on undefined email', () => {
                expect(() => { logic.authenticateUser(undefined, password) }).to.throw(TypeError, 'undefined is not a string')
            })
            it('should fail on undefined pasword', () => {
                expect(() => { logic.authenticateUser(email, undefined) }).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty email', () => {
                expect(() => { logic.authenticateUser('', password) }).to.throw(ValueError, `email is empty or blank`)
            })
            it('should fail on empty pasword', () => {
                expect(() => { logic.authenticateUser(email, '') }).to.throw(ValueError, `password is empty or blank`)
            })

            it('should fail on blank email', () => {
                expect(() => { logic.authenticateUser('', password) }).to.throw(ValueError, `email is empty or blank`)
            })
            it('should fail on blank pasword', () => {
                expect(() => { logic.authenticateUser(email, '') }).to.throw(ValueError, `password is empty or blank`)
            })


            it('should fail on non-string email(boolean)', () => {
                expect(() => { logic.authenticateUser(false, password) }).to.throw(TypeError, 'false is not a string')
            })
            it('should fail on non-string pasword(boolean)', () => {
                expect(() => { logic.authenticateUser(email, false) }).to.throw(TypeError, 'false is not a string')
            })


            it('should fail on non-string email(array)', () => {
                expect(() => { logic.authenticateUser([], password) }).to.throw(TypeError, ' is not a string')
            })
            it('should fail on non-string pasword(array)', () => {
                expect(() => { logic.authenticateUser(email, []) }).to.throw(TypeError, ' is not a string')
            })


            it('should fail on non-string email(number)', () => {
                let email = Math.random()
                expect(() => { logic.authenticateUser(email, password) }).to.throw(TypeError, `${email} is not a string`)
            })
            it('should fail on non-string pasword(number)', () => {
                let password = Math.random()

                expect(() => { logic.authenticateUser(email, password) }).to.throw(TypeError, `${password} is not a string`)
            })
        })

        describe('retrieve User', () => {
            let user
            beforeEach(() => {
                name = 'John'
                surname = 'Doe'
                email = `jd-${Math.random()}@example.com`
                password = `jd-${Math.random()}`
                birthday = '20/02/2002'
                gender = 'Male'
                phone = `jdPhone-${Math.random()}`

                user = new User({ name, surname, email, password, birthday, gender, phone })

                return user.save()
            })

            it('should succed on correct data', async () => {
                const _user = await logic.retrieveUser(user.id)

                expect(_user).not.to.be.instanceOf(User)

                expect(_user.id).to.be.a('string')
                expect(_user.name).to.equal(user.name)
                expect(_user.surname).to.equal(user.surname)
                expect(_user.email).to.equal(user.email)
                expect(_user.birthday).to.equal(user.birthday)
                expect(_user.profilePicture).to.equal('https://res.cloudinary.com/dancing890/image/upload/v1542808705/i4lb8xdnpblbbhuvi7zv.png')

            })


            it('should fail on non existing user', async () => {
                const id = user.id

                await User.deleteMany()

                debugger
                try {
                    const __user = await logic.retrieveUser(id)
                    expect(true).to.be.false
                } catch (error) {
                    debugger
                    expect(error).to.be.instanceof(NotFoundError)

                    expect(error.message).to.equal(`user not found`)
                }
            })
        })

        describe('add profile pictures ', () => {
            let user
            beforeEach(() => {
                name = 'John'
                surname = 'Doe'
                email = `jd-${Math.random()}@example.com`
                password = `jd-${Math.random()}`
                birthday = '20/02/2002'
                gender = 'Male'
                phone = `jdPhone-${Math.random()}`

                user = new User({ name, surname, email, password, birthday, gender, phone })

                return user.save()
            })

            it('should succed on correct data', async () => {

                let image = './data/test-images/default-profile-pic.png'

                var file = fs.createReadStream(image)

                const res = await logic.addProfilePicture(user.id, file)

                expect(res).to.be.undefined

                let _users = await User.find()

                expect(_users.length).to.equal(1)

                let [_user] = _users

                expect(_user.id).to.be.a('string')
                expect(_user.name).to.equal(name)
                expect(_user.surname).to.equal(surname)
                expect(_user.email).to.equal(email)
                expect(_user.password).to.equal(password)
                expect(_user.birthday).to.equal(birthday)
                expect(_user.gender).to.equal(gender)
                expect(_user.phone).to.equal(phone)
                expect(_user.profilePicture).to.be.a('string')
                expect(_user.profilePicture).not.to.equal('https://res.cloudinary.com/dancing890/image/upload/v1542808705/i4lb8xdnpblbbhuvi7zv.png')

                cloudinary.uploader.destroy(_user.profilePublicId, (result) => { });
            })
        })

        describe('list user pictures', () => {
            let user, place, picture
            beforeEach(async () => {
                let name = 'John'
                let surname = 'Doe'
                let email = `jd-${Math.random()}@example.com`
                let password = `jd-${Math.random()}`
                let birthday = '20/02/2002'
                let gender = 'Male'
                let phone = `jdPhone-${Math.random()}`

                user = new User({ name, surname, email, password, birthday, gender, phone })

                let placeName = 'Costa Dorada'
                let latitude = 41.398469
                let longitud = 2.199943
                let userId = user.id
                let breakfast = true
                let lunch = false
                let dinner = true
                let coffee = false
                let nigthLife = true
                let thingsToDo = false

                place = new Place({ name: placeName, latitude, longitud, userId, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo })

                url = 'http://res.cloudinary.com/dancing890/image/upload/v1542718364/h7nnejboqjyirdyq5tfo.png'

                picture = new Picture({ url, userId: user.id, public_id: 'h7nnejboqjyirdyq5tfo', placeId: place.id })

                await user.save()
                await place.save()
                await picture.save()
            })
            it('should succed on correct data', async () => {
                const pictureUrls = await logic.listUserPictures(user.id)

                expect(pictureUrls.length).to.equal(1)

                const [pictureUrl] = pictureUrls
                expect(pictureUrl).to.be.a('string')
                expect(pictureUrl).to.equal(url)

                const _pictures = await Picture.find({ userId: user.id })

                expect(_pictures.length).to.equal(1)

                const [_picture] = _pictures
                expect(_picture.url).to.be.equal(pictureUrl)
            })
        })

    })


    false && describe('places', () => {
        let user

        beforeEach(() => {
            let name = 'John'
            let surname = 'Doe'
            let email = `jd-${Math.random()}@example.com`
            let password = `jd-${Math.random()}`
            let birthday = '20/02/2002'
            let gender = 'Male'
            let phone = `jdPhone-${Math.random()}`

            user = new User({ name, surname, email, password, birthday, gender, phone })

            return user.save()
        })

        describe('add place', () => {
            it('should succed on correct data', async () => {
                let placeName = 'Costa Dorada'
                let latitude = 41.398469
                let longitud = 2.199943
                let address = "Street st, 43, Barcelona"
                let userId = user.id
                let breakfast = true
                let lunch = false
                let dinner = true
                let coffee = false
                let nigthLife = true
                let thingsToDo = false

                const res = await logic.addPlace(placeName, latitude, longitud, address, userId, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo)

                expect(res).to.be.undefined

                const places = await Place.find()

                expect(places.length).to.be.equal(1)


                const [place] = places

                expect(place.id).to.be.a('string')
                expect(place.name).to.equal(placeName)
                expect(place.latitude).to.equal(latitude)
                expect(place.longitud).to.equal(longitud)
                expect(place.userId.toString()).to.equal(user.id)
                expect(place.scoring).to.equal(0)
                expect(place.breakfast).to.equal(breakfast)
                expect(place.lunch).to.equal(lunch)
                expect(place.dinner).to.equal(dinner)
                expect(place.coffee).to.equal(coffee)
                expect(place.nigthLife).to.equal(nigthLife)
                expect(place.thingsToDo).to.equal(thingsToDo)

            })

        })

        describe('list places by name', () => {
            let place

            beforeEach(async () => {
                let placeName = 'Costa Dorada'
                let latitude = 41.398469
                let longitud = 2.199943
                let address = "Street st, 43, Barcelona"
                let userId = user.id
                let scoring = 0
                let breakfast = true
                let lunch = false
                let dinner = true
                let coffee = false
                let nigthLife = true
                let thingsToDo = false

                place = new Place({ name: placeName, latitude, longitud, address, userId, scoring, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo })

                await place.save()
            })
            it('should succed on correct name', async () => {
                const places = await logic.listPlacesByName(place.name)

                const [_place] = places

                expect(_place).not.to.be.instanceof(Place)
                expect(_place.id).to.be.a('string')
                expect(_place.name).to.equal(place.name)
                // expect(_place.latitude).to.equal(place.latitude)
                // expect(_place.longitud).to.equal(place.longitud)
                // expect(_place.address).to.equal(place.address)
                expect(_place.scoring).to.be.a('number')

            })

        })
        describe('list places by filter', () => {
            let place

            beforeEach(async () => {
                let placeName = 'Costa Dorada'
                let latitude = 41.398469
                let longitud = 2.199943
                let address = "Street st, 43, Barcelona"
                let userId = user.id
                let scoring = 0
                let breakfast = 'on'
                let lunch = 'off'
                let dinner = 'off'
                let coffee = 'off'
                let nigthLife = 'off'
                let thingsToDo = 'off'

                place = new Place({ name: placeName, latitude, longitud, address, userId, scoring, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo })

                let placeName2 = 'Costa Dorada2'
                let latitude2 = 41.398469
                let longitud2 = 2.199943
                let address2 = "Street st, 45, Barcelona"
                let userId2 = user.id
                let scoring2 = 0
                let breakfast2 = 'off'
                let lunch2 = 'on'
                let dinner2 = 'off'
                let coffee2 = 'off'
                let nigthLife2 = 'off'
                let thingsToDo2 = 'off'

                place2 = new Place({ name: placeName2, latitude: latitude2, longitud: longitud2, addres: address2, userId: userId2, scoring: scoring2, breakfast: breakfast2, lunch: lunch2, dinner: dinner2, coffee: coffee2, nightLife: nigthLife2, thingsToDo: thingsToDo2 })

                await place.save()
                await place2.save()
            })
            it('should succed on correct name', async () => {
                let filter = 'breakfast'

                const places = await logic.listPlacesByFilter(filter)

                const [_place] = places

                expect(_place).not.to.be.instanceof(Place)
                expect(_place.id).to.be.a('string')
                expect(_place.name).to.equal(place.name)
                expect(_place.latitude).to.equal(place.latitude)
                expect(_place.longitud).to.equal(place.longitud)
                expect(_place.address).to.equal(place.address)
                expect(_place.scoring).to.be.a('number')

            })

        })

        describe('retrieve place by Id', () => {
            let place

            beforeEach(async () => {
                let placeName = 'Costa Dorada'
                let latitude = 41.398469
                let longitud = 2.199943
                let address = "Street st, 43, Barcelona"
                let userId = user.id
                let scoring = 0
                let breakfast = true
                let lunch = false
                let dinner = true
                let coffee = false
                let nigthLife = true
                let thingsToDo = false

                place = new Place({ name: placeName, latitude, longitud, address, userId, scoring, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo })

                await place.save()
            })
            it('should succed on correct name', async () => {
                const _place = await logic.retrievePlaceById(place.id)

                expect(_place).not.to.be.instanceof(Place)
                expect(_place.id).to.be.a('string')
                expect(_place.name).to.equal(place.name)
                expect(_place.latitude).to.equal(place.latitude)
                expect(_place.longitud).to.equal(place.longitud)
                expect(_place.address).to.equal(place.address)
                expect(_place.scoring).to.be.a('number')
                expect(_place.breakfast).to.equal(place.breakfast)
                expect(_place.lunch).to.equal(place.lunch)
                expect(_place.dinner).to.equal(place.dinner)
                expect(_place.coffee).to.equal(place.coffee)
                expect(_place.nigthLife).to.equal(place.nigthLife)
                expect(_place.thingsToDo).to.equal(place.thingsToDo)

            })

        })

        describe('update scoring', () => {
            let place

            beforeEach(async () => {
                let placeName = 'Costa Dorada'
                let latitude = 41.398469
                let longitud = 2.199943
                let address = "Street st, 43, Barcelona"
                let userId = user.id
                let scoring = 5
                let scores = [5]
                let breakfast = true
                let lunch = false
                let dinner = true
                let coffee = false
                let nigthLife = true
                let thingsToDo = false

                place = new Place({ name: placeName, latitude, longitud, address, userId, scoring, scores, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo })

                await place.save()
            })
            it('should succed on correct data', async () => {
                let newScore = 10

                const { scoring, scores } = await logic.updateScoring(place.id, newScore)

                expect(scoring).to.equal(7.5)
                expect(scores.length).to.equal(2)
                expect(scores[0]).to.equal(5)
                expect(scores[1]).to.equal(10)

                const _place = await Place.findById(place.id)

                expect(_place.name).to.equal(place.name)
                expect(_place.latitude).to.equal(place.latitude)
                expect(_place.longitud).to.equal(place.longitud)
                expect(_place.address).to.equal(place.address)
                expect(_place.breakfast).to.equal(place.breakfast)
                expect(_place.lunch).to.equal(place.lunch)
                expect(_place.dinner).to.equal(place.dinner)
                expect(_place.coffee).to.equal(place.coffee)
                expect(_place.nigthLife).to.equal(place.nigthLife)
                expect(_place.thingsToDo).to.equal(place.thingsToDo)

                expect(_place.scoring).to.be.a('number')
                expect(_place.scoring).to.equal(7.5)
                expect(_place.scores.length).to.equal(2)
                expect(_place.scores[0]).to.equal(5)
                expect(_place.scores[1]).to.equal(10)


            })

        })

        describe('add place pictures ', () => {
            let place
            beforeEach(async () => {
                let placeName = 'Costa Dorada'
                let latitude = 41.398469
                let longitud = 2.199943
                let userId = user.id
                let breakfast = true
                let lunch = false
                let dinner = true
                let coffee = false
                let nigthLife = true
                let thingsToDo = false

                place = new Place({ name: placeName, latitude, longitud, userId, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo })

                await place.save()
            })

            it('should succed on correct data', async () => {

                let image = './data/test-images/default-place-pic.png'

                var file = fs.createReadStream(image)

                const res = await logic.addPlacePicture(user.id, place.id, file)

                expect(res).to.be.undefined

                const pictures = await Picture.find()

                expect(pictures.length).to.be.equal(1)


                const [picture] = pictures

                expect(picture.id).to.be.a('string')
                expect(picture.url).to.be.a('string')
                expect(picture.public_id).to.be.a('string')
                expect(picture.userId.toString()).to.equal(user.id)
                expect(picture.placeId.toString()).to.equal(place.id)

                cloudinary.uploader.destroy(picture.public_id, (result) => { });
            })


        })

        describe('list place pictures', () => {
            beforeEach(async () => {
                let name = 'John'
                let surname = 'Doe'
                let email = `jd-${Math.random()}@example.com`
                let password = `jd-${Math.random()}`
                let birthday = '20/02/2002'
                let gender = 'Male'
                let phone = `jdPhone-${Math.random()}`

                user = new User({ name, surname, email, password, birthday, gender, phone })

                let placeName = 'Costa Dorada'
                let latitude = 41.398469
                let longitud = 2.199943
                let userId = user.id
                let breakfast = true
                let lunch = false
                let dinner = true
                let coffee = false
                let nigthLife = true
                let thingsToDo = false

                place = new Place({ name: placeName, latitude, longitud, userId, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo })

                url = 'http://res.cloudinary.com/dancing890/image/upload/v1542718364/h7nnejboqjyirdyq5tfo.png'

                picture = new Picture({ url, userId: user.id, public_id: 'h7nnejboqjyirdyq5tfo', placeId: place.id })

                await user.save()
                await place.save()
                await picture.save()
            })
            it('should succed on correct data', async () => {
                const pictureUrls = await logic.listPlacePictures(place.id)

                expect(pictureUrls.length).to.equal(1)

                const [pictureUrl] = pictureUrls
                expect(pictureUrl).to.be.a('string')
                expect(pictureUrl).to.equal(url)

                const _pictures = await Picture.find({ placeId: place.id })

                expect(_pictures.length).to.equal(1)

                const [_picture] = _pictures
                expect(_picture.url).to.be.equal(pictureUrl)
            })
        })

    })

    false && describe('tips', () => {
        let user, place
        beforeEach(async () => {
            let name = 'John'
            let surname = 'Doe'
            let email = `jd-${Math.random()}@example.com`
            let password = `jd-${Math.random()}`
            let birthday = '20/02/2002'
            let gender = 'Male'
            let phone = `jdPhone-${Math.random()}`

            user = new User({ name, surname, email, password, birthday, gender, phone })

            let placeName = 'Costa Dorada'
            let latitude = 41.398469
            let longitud = 2.199943
            let userId = user.id
            let breakfast = true
            let lunch = false
            let dinner = true
            let coffee = false
            let nigthLife = true
            let thingsToDo = false

            place = new Place({ name: placeName, latitude, longitud, userId, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo })

            await user.save()
            await place.save()
        })
        describe('add tips', () => {
            it('should succed on correct data', async () => {
                let text = `text-${Math.random()}`

                const res = await logic.addTip(user.id, place.id, text)

                expect(res).to.be.undefined

                const tips = await Tip.find()

                expect(tips.length).to.equal(1)

                const [tip] = tips

                expect(tip.id).to.be.a('string')
                expect(tip.userId.toString()).to.equal(user.id)
                expect(tip.placeId.toString()).to.equal(place.id)
            })
        })
        describe('list tips by place Id', () => {
            let tip
            beforeEach(async () => {
                let text = `text-${Math.random()}`

                tip = new Tip({ userId: user.id, placeId: place.id, text })

                await tip.save()
            })
            it('should succced on correct data', async () => {
                const tips = await logic.listPlaceTips(place.id)

                expect(tips.length).to.equal(1)

                const [_tip] = tips

                expect(_tip.id).to.be.a('string')
                expect(_tip.id).to.equal(tip.id)
                expect(_tip.userId.toString()).to.equal(tip.userId.toString())
                expect(_tip.placeId.toString()).to.equal(tip.placeId.toString())
                expect(_tip.userName).to.equal(user.name)
                expect(_tip.userPicture).to.equal(user.profilePicture)


            })
        })

        describe('list tips by user Id', () => {
            let tip
            beforeEach(async () => {
                let text = `text-${Math.random()}`

                tip = new Tip({ userId: user.id, placeId: place.id, text })

                await tip.save()
            })
            it('should succced on correct data', async () => {
                const tips = await logic.listUserTips(user.id)

                expect(tips.length).to.equal(1)

                const [_tip] = tips

                expect(_tip.id).to.be.a('string')
                expect(_tip.id).to.equal(tip.id)
                expect(_tip.userId.toString()).to.equal(tip.userId.toString())
                expect(_tip.placeId.toString()).to.equal(tip.placeId.toString())
            })
        })
    })

    describe('favourites', () => {
        let user, place
        beforeEach(async () => {
            let name = 'John'
            let surname = 'Doe'
            let email = `jd-${Math.random()}@example.com`
            let password = `jd-${Math.random()}`
            let birthday = '20/02/2002'
            let gender = 'Male'
            let phone = `jdPhone-${Math.random()}`

            user = new User({ name, surname, email, password, birthday, gender, phone })

            let placeName = 'Costa Dorada'
            let latitude = 41.398469
            let longitud = 2.199943
            let userId = user.id
            let address = 'address st'
            let breakfast = true
            let lunch = false
            let dinner = true
            let coffee = false
            let nigthLife = true
            let thingsToDo = false

            place = new Place({ name: placeName, latitude, longitud, userId, address, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo })

            await user.save()
            await place.save()
        })
        describe('add favourites', () => {
            it('it should succedd on correct data', async () => {
                const res = await logic.addFavourites(user.id, place.id)

                expect(res).to.be.undefined

                const _user = await User.findById(user.id)

                expect(_user.favourites.length).to.equal(1)
                expect(_user.favourites[0]._id.toString()).to.equal(place.id)
            })

        })
        describe('list favourites', () => {
            it('it should succedd on correct data', async () => {
                user.favourites.push(place.id)

                await user.save()

                const favourites = await logic.listFavourites(user.id)

                expect(favourites.length).to.equal(1)

                const [favourite] = favourites
                expect(favourite.address).to.equal(place.address)
                expect(favourite.scoring).to.equal(place.scoring)
            })
        })



    })


    describe('CheckIns', () => {
        let user, place
        beforeEach(async () => {
            let name = 'John'
            let surname = 'Doe'
            let email = `jd-${Math.random()}@example.com`
            let password = `jd-${Math.random()}`
            let birthday = '20/02/2002'
            let gender = 'Male'
            let phone = `jdPhone-${Math.random()}`

            user = new User({ name, surname, email, password, birthday, gender, phone })

            let placeName = 'Costa Dorada'
            let latitude = 41.398469
            let longitud = 2.199943
            let userId = user.id
            let address = 'address st'
            let breakfast = true
            let lunch = false
            let dinner = true
            let coffee = false
            let nigthLife = true
            let thingsToDo = false

            place = new Place({ name: placeName, latitude, longitud, userId, address, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo })

            await user.save()
            await place.save()
        })
        describe('add CheckIns', () => {
            it('it should succedd on correct data', async () => {
                const res = await logic.addCheckIns(user.id, place.id)

                expect(res).to.be.undefined

                const _user = await User.findById(user.id)

                expect(_user.checkIns.length).to.equal(1)
                expect(_user.checkIns[0]._id.toString()).to.equal(place.id)
            })

        })
        describe('list CheckIns', () => {
            it('it should succedd on correct data', async () => {
                user.checkIns.push(place.id)

                await user.save()

                const checkIns = await logic.listCheckIns(user.id)

                expect(checkIns.length).to.equal(1)

                const [checkIn] = checkIns
                expect(checkIn.address).to.equal(place.address)
                expect(checkIn.scoring).to.equal(place.scoring)
            })
        })

    })


    after(() => mongoose.disconnect())
})