const { models: { User, Place, Picture, ProfilePicture } } = require('skysquare-data')
const { AlreadyExistsError, AuthError, NotFoundError } = require('../errors')
const validate = require('../utils/validate')
var cloudinary = require('cloudinary')


cloudinary.config({
    cloud_name: 'dancing890',
    api_key: '534167988966151',
    api_secret: 'CpjYh3OdFdUc8BVB2h1gCMyX1cE'
})

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

    },

    retrieveUser(id) {
        validate([
            { key: 'id', value: id, type: String }
        ])
        return (async () => {
            const user = await User.findById(id, { password: 0, postits: 0, __v: 0 }).lean()

            if (!user) throw new NotFoundError(`user with email ${email} not found`)

            user.id = user._id.toString()

            delete user._id

            return user
        })()


    },

    addProfilePicture(userId, file) {
        validate([
            { key: 'userId', value: userId, type: String },

        ])

        return (async () => {
            let user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user does not exist`)

            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((result, error) => {
                    if (error) return reject(error)

                    resolve(result)
                })

                file.pipe(stream)
            })
            profilePicture = new ProfilePicture({ url: result.url, public_id: result.public_id, userId })

            await profilePicture.save()

            user.profilePicture = profilePicture.id

            await user.save()
        })()
    },


    addPlace(name, latitude, longitud, address, userId, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo) {
        validate([
            { key: 'name', value: name, type: String },
            { key: 'latitude', value: latitude, type: Number },
            { key: 'longitud', value: longitud, type: Number },
            { key: 'address', value: address, type: String },
            { key: 'userId', value: userId, type: String },
            { key: 'breakfast', value: breakfast, type: Boolean, optional: true },
            { key: 'lunch', value: lunch, type: Boolean, optional: true },
            { key: 'dinner', value: dinner, type: Boolean, optional: true },
            { key: 'coffee', value: coffee, type: Boolean, optional: true },
            { key: 'nigthLife', value: nigthLife, type: Boolean, optional: true },
            { key: 'thingsToDo', value: thingsToDo, type: Boolean, optional: true }
        ])
        return (async () => {
            let user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user does not exist`)

            let place = new Place({ name, latitude, longitud, userId, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo })

            place.scoring = 0
            place.scores = []
            address != null && (user.address = address)

            await place.save()
        })()

    },

    listPlacesByName(name) {
        validate([
            { key: 'name', value: name, type: String },
        ])

        return (async () => {
            let places = await Place.find({ name }, { userId: 0, __v: 0 }).lean()

            places.forEach(place => {
                place.id = place._id.toString()

                delete place._id

                return place
            })

            return places.map(({ id, name, latitude, longitud, address, scoring }) => ({ id, name, latitude, longitud, address, scoring }))

        })()
    },

    listPlacesByFilter(filter) {
        validate([
            { key: 'filter', value: filter, type: String },
        ])

        return (async () => {

            let places = await Place.find({ [filter]: true }, { userId: 0, __v: 0 }).lean()
            
            const listPlaces = await Promise.all(
                places.forEach(async place => {
                    const pictures = await Picture.findById(place.id)

                    if(pictures) {
                        const picture = "https://res.cloudinary.com/dancing890/image/upload/v1542807002/waxfi0xtcm5u48yltzxc.png"
                    } else {

                    const picture = pictures[Math.floor(Math.random()*items.length)];
                    }
                    
                    place.picture = picture

                    place.id = place._id.toString()
    
                    delete place._id
                    
                    return place
                })
            )
            
            return listPlaces.map(({ id, name, latitude, longitud, address, scoring, picture }) => ({ id, name, latitude, longitud, address, scoring, picture }))
        })()
    },

    retrievePlaceById(id) {
        validate([
            { key: 'id', value: id, type: String },
        ])

        return (async () => {
            let place = await Place.findById(id, { userId: 0, __v: 0 }).lean()

            place.id = place._id.toString()

            delete place._id

            return place

        })()
    },

    updateScoring(placeId, score) {
        validate([
            { key: 'score', value: score, type: Number },
        ])

        return (async () => {
            let place = await Place.findById(placeId)

            if (!place) throw new NotFoundError(`place does not exist`)
            debugger
            place.scores.push(score)

            if (place.scores.length === 1){
                place.scoring = score
            } else {
                const sum = place.scores.reduce((a, b) => a + b, 0)

                place.scoring = +(sum / place.scores.length).toFixed(0)
            }
                
            await place.save()

            return place
        })()
    },

    addPlacePicture(userId, placeId, file) {
        validate([
            { key: 'userId', value: userId, type: String },
            { key: 'placeId', value: placeId, type: String },

        ])

        return (async () => {
            let user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user does not exist`)

            let place = await Place.findById(placeId)

            if (!place) throw new NotFoundError(`place does not exist`)

            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((result, error) => {
                    if (error) return reject(error)

                    resolve(result)
                })

                file.pipe(stream)
            })

            picture = new Picture({ url: result.url, public_id: result.public_id, userId, placeId })

            await picture.save()
        })()
    },

    listPlacePictures(placeId) {
        validate([
            { key: 'placeId', value: placeId, type: String },
        ])

        return (async () => {
            let place = await Place.findById(placeId)

            if (!place) throw new NotFoundError(`place does not exist`)

            const pictures = await Picture.find({ placeId })

            const pictureUrls = pictures.map(picture => picture.url)

            return pictureUrls
        })()

    },

    listUserPictures(userId) {
        validate([
            { key: 'userId', value: userId, type: String },
        ])

        return (async () => {
            let user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user does not exist`)

            const pictures = await Picture.find({ userId })

            const pictureUrls = pictures.map(picture => picture.url)

            return pictureUrls
        })()

    },



}

module.exports = logic