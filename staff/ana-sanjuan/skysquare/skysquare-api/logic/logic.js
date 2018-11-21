const { models: { User, Place, Picture } } = require('skysquare-data')
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

    retrieveUser(email) {
        validate([
            { key: 'email', value: email, type: String }
        ])
        return (async () => {
            const user = await User.findOne({ email }, { password: 0, postits: 0, __v: 0 }).lean()

            if (!user) throw new NotFoundError(`user with email ${email} not found`)

            user.id = user._id.toString()

            delete user._id

            return user
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

            let place = new Place({ name, latitude, longitud, address, userId, breakfast, lunch, dinner, coffee, nigthLife, thingsToDo })

            place.scoring = 0

            await place.save()
        })()

    },

    findPlaceByName(name) {
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

            return places
        })()
    },

    listPlacesByFilter(filter) {
        validate([
            { key: 'filter', value: filter, type: String },
        ])

        return (async () => {

            let places = await Place.find({ [filter]: true }, { userId: 0, __v: 0 }).lean()

            places.forEach(place => {
                place.id = place._id.toString()

                delete place._id

                return place
            })

            return places
        })()
    },

    findPlaceById(id) {
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

            place.votes += 1

            place.scoring = (place.scoring + score) / place.votes

            await place.save()
        })()
    },
    //with local image

    // addPlacePicture(userId, placeId, image) {
    //     validate([
    //         { key: 'userId', value: userId, type: String },
    //         { key: 'placeId', value: placeId, type: String },
    //         { key: 'image', value: image, type: String }

    //     ])

    //     return (async () => {
    //         let user = await User.findById(userId)

    //         if (!user) throw new NotFoundError(`user does not exist`)

    //         let place = await Place.findById(placeId)

    //         if (!place) throw new NotFoundError(`place does not exist`)

    //         let picture

            // await cloudinary.v2.uploader.upload(image, (error, result) => {
            //     if (error) return error

            //     picture = new Picture({ url: result.url, public_id: result.public_id, userId, placeId })
            // })

    //         await picture.save()
    //     })()
    // },

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

    // { 
    //     public_id: 'sample',
    //     version: 1312461204,
    //     width: 864,
    //     height: 576,
    //     format: 'jpg',
    //     bytes: 120253,
    //     url: 'https://res.cloudinary.com/demo/image/upload/v1371281596/sample.jpg',
    //     secure_url: 'https://res.cloudinary.com/demo/image/upload/v1371281596/sample.jpg' 
    //   }

    // // Stream upload
    // var upload_stream= cloudinary.uploader.upload_stream({tags: 'basic_sample'},function(err,image) {
    //     console.log();
    //     console.log("** Stream Upload");
    //     if (err){ console.warn(err);}
    //     console.log("* Same image, uploaded via stream");
    //     console.log("* "+image.public_id);
    //     console.log("* "+image.url);
    //     waitForAllUploads("pizza3",err,image);
    //   });
    //   var file_reader = fs.createReadStream('pizza.jpg').pipe(upload_stream);



    listPlacePictures(placeId) {
        validate([
            { key: 'placeId', value: placeId, type: String },
        ])

        return (async () => {
            let place = await Place.findById(placeId)

            if (!place) throw new NotFoundError(`place does not exist`)

            const pictures = await Picture.find({ placeId })

            const pictureUrls = pictures.map(url => picture.url)

            return pictureUrls
        })()

    },
}

module.exports = logic