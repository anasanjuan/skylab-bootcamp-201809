const {mongoose, models: { User, Place, Picture,ProfilePicture }} = require('skysquare-data')
const logic = require('./logic')
const { AlreadyExistsError, AuthError } = require('../errors')
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

    beforeEach(() => Promise.all([User.deleteMany(), Place.deleteMany(), Picture.deleteMany(), ProfilePicture.deleteMany()]))
    

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
            it('should fail on undefined name', () => {
                expect(() => { logic.registerUser(undefined, surname, email, password, birthday, gender, phone) }).to.throw(TypeError, 'undefined is not a string')
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

            it('should fail on incorrect password ', async () => {
                const { email } = user
                let wrongPassword = `jd-${Math.random()}`

                try {
                    const id = await logic.authenticateUser(email, wrongPassword)
                    expect(true).to.be.false
                } catch (error) {
                    expect(error).to.be.instanceof(AuthError)

                    expect(error.message).to.equal(`incorrect user or password`)
                }
            })

            it('should fail on undefined email', () => {
                expect(() => { logic.registerUser(undefined, password) }).to.throw(TypeError, 'undefined is not a string')

            })
            it('should fail on undefined pasword', () => {
                expect(() => { logic.registerUser(email, undefined) }).to.throw(TypeError, 'undefined is not a string')

            })
        })

        describe('retrieve User', ()=> {
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
                expect(_user.gender).to.equal(user.gender)
                expect(_user.phone).to.equal(user.phone)

            })
        })

        describe('add profile pictures ', ()=> {
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


                const profilePictures = await ProfilePicture.find()
    
                expect(profilePictures.length).to.be.equal(1)
    
    
                const [profilePicture] = profilePictures

                expect(profilePicture.id).to.equal(_user.profilePicture._id.toString())
                expect(profilePicture.id).to.be.a('string')
                expect(profilePicture.url).to.be.a('string')
                expect(profilePicture.public_id).to.be.a('string')
                expect(profilePicture.userId.toString()).to.equal(user.id)
                
                cloudinary.uploader.destroy(profilePictures.public_id, (result) => { });

                
            })
        }) 

        describe('list user pictures', () => {
            let user, place, picture
            beforeEach(async()=> {
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
    
                place = new Place({name: placeName, latitude, longitud,  userId, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo})
                
                url= 'http://res.cloudinary.com/dancing890/image/upload/v1542718364/h7nnejboqjyirdyq5tfo.png'

                picture = new Picture ({url, userId: user.id, public_id:'h7nnejboqjyirdyq5tfo', placeId: place.id})
                
                await user.save()
                await place.save()
                await picture.save()
            })
            it('should succed on correct data', async ()=> {
                const pictureUrls = await logic.listUserPictures(user.id)

                expect(pictureUrls.length).to.equal(1)
                
                const [pictureUrl] = pictureUrls
                expect(pictureUrl).to.be.a('string')
                expect(pictureUrl).to.equal(url)

                const _pictures = await Picture.find({userId: user.id})

                expect(_pictures.length).to.equal(1)
                
                const [_picture] = _pictures
                expect(_picture.url).to.be.equal(pictureUrl)
            })
        }) 

    })


    describe('places', () => {
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
    
                place = new Place({name: placeName, latitude, longitud, address, userId, scoring, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo})
                
                await place.save()
            })
            it('should succed on correct name', async () => {
                const places = await logic.listPlacesByName(place.name)

                const [_place ] = places
                
                expect(_place).not.to.be.instanceof(Place)
                expect(_place.id).to.be.a('string')
                expect(_place.name).to.equal(place.name)
                expect(_place.latitude).to.equal(place.latitude)
                expect(_place.longitud).to.equal(place.longitud)
                expect(_place.address).to.equal(place.address)
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
                let breakfast = true
                let lunch = false
                let dinner = false
                let coffee = false
                let nigthLife = false
                let thingsToDo = false
    
                place = new Place({name: placeName, latitude, longitud, address, userId, scoring, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo})
                
                let placeName2 = 'Costa Dorada2'
                let latitude2 = 41.398469
                let longitud2 = 2.199943
                let address2 = "Street st, 45, Barcelona"
                let userId2 = user.id
                let scoring2 = 0
                let breakfast2 = false
                let lunch2 = true
                let dinner2 = false
                let coffee2 = false
                let nigthLife2 = false
                let thingsToDo2 = false
    
                place2 = new Place({name: placeName2, latitude: latitude2, longitud: longitud2, addres: address2, userId: userId2, scoring: scoring2, breakfast: breakfast2, lunch: lunch2, dinner: dinner2, coffee: coffee2, nightLife: nigthLife2, thingsToDo: thingsToDo2})
                
                await place.save()
                await place2.save()
            })
            it('should succed on correct name', async () => {
                let filter = 'breakfast'

                const places = await logic.listPlacesByFilter(filter)
                
                const [_place ] = places

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
    
                place = new Place({name: placeName, latitude, longitud, address, userId, scoring, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo})
                
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
                let votes = 2
                let breakfast = true
                let lunch = false
                let dinner = true
                let coffee = false
                let nigthLife = true
                let thingsToDo = false
    
                place = new Place({name: placeName, latitude, longitud, address, userId, scoring, votes, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo})
                
                await place.save()
            })
            it('should succed on correct data', async () => {
                let newScore = 10

                const res = await logic.updateScoring(place.id, newScore)
                
                expect(res).to.be.undefined

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
                expect(_place.scoring).to.equal(5)


            })

        })

        describe('add place pictures ', ()=> {
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
    
                place = new Place({name: placeName, latitude, longitud,  userId, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo})
                
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
            beforeEach(async()=> {
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
    
                place = new Place({name: placeName, latitude, longitud,  userId, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo})
                
                url= 'http://res.cloudinary.com/dancing890/image/upload/v1542718364/h7nnejboqjyirdyq5tfo.png'

                picture = new Picture ({url, userId: user.id, public_id:'h7nnejboqjyirdyq5tfo', placeId: place.id})
                
                await user.save()
                await place.save()
                await picture.save()
            })
            it('should succed on correct data', async ()=> {
                const pictureUrls = await logic.listPlacePictures(place.id)

                expect(pictureUrls.length).to.equal(1)
                
                const [pictureUrl] = pictureUrls
                expect(pictureUrl).to.be.a('string')
                expect(pictureUrl).to.equal(url)

                const _pictures = await Picture.find({placeId: place.id})

                expect(_pictures.length).to.equal(1)
                
                const [_picture] = _pictures
                expect(_picture.url).to.be.equal(pictureUrl)
            })
        }) 


        
    })
    
    after(() => mongoose.disconnect())
})