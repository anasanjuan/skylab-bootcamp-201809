const { models: { User, Place, Picture, Tip } } = require('skysquare-data')
const { AlreadyExistsError, AuthError, NotFoundError } = require('../errors')
const validate = require('../utils/validate')
var cloudinary = require('cloudinary')
var moment = require('moment')

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

            if (!user) throw new NotFoundError(`user with email ${email} not found`)

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

            delete user.password

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
            user.profilePicture = result.url

            user.profilePublicId = result.public_id

            await user.save()

            return user.profilePicture
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

            address != null && (user.address = address)

            await place.save()
        })()
    },

    listPlacesByName(name) {
        validate([
            { key: 'name', value: name, type: String },
        ])

        return (async () => {

            let placeReg = new RegExp(name, "i")

            let places = await Place.find({ name: { $regex: placeReg } }, { userId: 0, __v: 0 }).lean()

            let promises = places.map(async place => {
                const pictures = await Picture.find({ placeId: place._id })

                if (pictures.length === 0) {
                    const picture = "https://res.cloudinary.com/dancing890/image/upload/v1542807002/waxfi0xtcm5u48yltzxc.png"

                    place.picture = picture
                } else {
                    const picture = pictures[Math.floor(Math.random() * pictures.length)]

                    place.picture = picture.url
                }

                const tips = await Tip.find({ placeId: place._id })

                if (tips.length === 0) {
                    place.tip = ''

                } else {
                    const tip = tips[Math.floor(Math.random() * tips.length)]

                    place.tip = tip.text
                }
                place.id = place._id.toString()

                delete place._id

                return place
            })
            const listPlaces = await Promise.all(promises)

            return listPlaces.map(({ id, name, address, scoring, picture, tip }) => ({ id, name, address, scoring, picture, tip }))
        })()
    },

    listPlacesByFilter(filter) {
        validate([
            { key: 'filter', value: filter, type: String },
        ])

        return (async () => {
            let places = await Place.find({ [filter]: true }, { userId: 0, __v: 0 }).lean()

            const listPlaces = await Promise.all(
                places.map(async place => {
                    const pictures = await Picture.find({ placeId: place._id.toString() })

                    if (pictures.length === 0) {
                        const picture = "https://res.cloudinary.com/dancing890/image/upload/v1542807002/waxfi0xtcm5u48yltzxc.png"

                        place.picture = picture
                    } else {
                        const picture = pictures[Math.floor(Math.random() * pictures.length)]

                        place.picture = picture.url
                    }

                    const tips = await Tip.find({ placeId: place._id })


                    if (tips.length === 0) {
                        place.tip = ''

                    } else {
                        const tip = tips[Math.floor(Math.random() * tips.length)]

                        place.tip = tip.text
                    }
                    place.id = place._id.toString()

                    delete place._id

                    return place
                })
            )
            return listPlaces.map(({ id, name, address, scoring, picture, tip }) => ({ id, name, address, scoring, picture, tip }))
        })()
    },

    retrievePlaceById(userId, placeId) {
        validate([
            { key: 'placeId', value: placeId, type: String },
        ])
        return (async () => {

            let place = await Place.findById(placeId, { userId: 0, __v: 0 }).lean()

            if (!place) throw new NotFoundError(`place does not exist`)

            let user = await User.findById(userId, { userId: 0, __v: 0 }).lean()

            if (!user) throw new NotFoundError(`user does not exist`)

            const fav = user.favourites.find(fav => fav.toString() === placeId)

            place.favourite = fav ? true : false

            const check = user.checkIns.find(check => check.toString() === placeId)

            place.checkIn = check ? true : false

            const pictures = await Picture.find({ placeId })

            if (pictures.length === 0) {
                const picture = "http://res.cloudinary.com/dancing890/image/upload/b_rgb:2e5be3/v1542807002/waxfi0xtcm5u48yltzxc.png"

                place.picture = picture
            } else {
                const picture = pictures[Math.floor(Math.random() * pictures.length)]

                place.picture = picture.url
            }

            place.id = place._id.toString()

            delete place._id

            return place
        })()
    },

    updateScoring(userId, placeId, score) {
        validate([
            { key: 'userId', value: userId, type: String },
            { key: 'placeId', value: placeId, type: String },
            { key: 'score', value: score, type: Number },
        ])

        return (async () => {
            let place = await Place.findById(placeId)

            if (!place) throw new NotFoundError(`place does not exist`)

            const index = place.voters.findIndex(voter => voter.toString() === userId)
debugger
            if(index >= 0) throw new AlreadyExistsError(`user has already voted`)
debugger
            place.voters.push(userId)

            place.scores.push(score)

            if (place.scores.length === 1) {
                place.scoring = score
            } else {
                const sum = place.scores.reduce((a, b) => a + b, 0)

                place.scoring = +(sum / place.scores.length).toFixed(1)
            }

            await place.save()

            return { scoring: place.scoring, scores: place.scores }
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

            return picture.url
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

    addTip(userId, placeId, text) {
        validate([
            { key: 'userId', value: userId, type: String },
            { key: 'placeId', value: placeId, type: String },
            { key: 'text', value: text, type: String },

        ])
        return (async () => {
            const user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user does not exist`)

            const place = await Place.findById(placeId)

            if (!place) throw new NotFoundError(`place does not exist`)

            const time = moment().format('D MMMM YYYY')

            const tip = new Tip({ userId, placeId, text, time })

            await tip.save()

            return { userPicture: user.profilePicture, userName: user.name, userSurname: user.surname, text: tip.text, time: tip.time }
        })()
    },

    listPlaceTips(placeId) {
        validate([
            { key: 'placeId', value: placeId, type: String },
        ])

        return (async () => {
            let place = await Place.findById(placeId)

            if (!place) throw new NotFoundError(`place does not exist`)

            let tips = await Tip.find({ placeId })

            const listTips = await Promise.all(
                tips.map(async tip => {

                    const user = await User.findById(tip.userId)

                    tip.userPicture = user.profilePicture

                    tip.userName = user.name

                    tip.userSurname = user.surname

                    tip.id = tip._id.toString()

                    delete tip._id

                    return tip
                })
            )
            return listTips.map(({ id, text, userPicture, userName, userSurname, time }) => ({ id, text, userPicture, userName, userSurname, time }))
        })()
    },

    listUserTips(userId) {
        validate([
            { key: 'userId', value: userId, type: String },
        ])
        return (async () => {
            let user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user does not exist`)

            let tips = await Tip.find({ userId })

            let promises = tips.map(async tip => {
                let place = await Place.findById(tip.placeId)

                tip.placeName = place.name

                tip.scoring = place.scoring

                const pictures = await Picture.find({ placeId: tip.placeId })

                if (pictures.length === 0) {
                    const picture = "http://res.cloudinary.com/dancing890/image/upload/b_rgb:2e5be3/v1542807002/waxfi0xtcm5u48yltzxc.png"

                    tip.picture = picture
                } else {
                    const picture = pictures[Math.floor(Math.random() * pictures.length)]

                    tip.picture = picture.url
                }

                tip.id = tip._id.toString()

                delete tip._id

                return tip
            })

            let listTips = await Promise.all(promises)

            return listTips.map(({ id, text, placeId, picture, placeName, scoring, time }) => ({ id, text, placeId, picture, placeName, scoring, time }))
        })()
    },

    uploadFavourites(userId, placeId) {
        validate([
            { key: 'userId', value: userId, type: String },
            { key: 'placeId', value: placeId, type: String },

        ])
        return (async () => {
            let user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user does not exist`)

            let place = await Place.findById(placeId)

            if (!place) throw new NotFoundError(`place does not exist`)

            const index = user.favourites.findIndex(fav => fav.toString() === placeId)

            if (index >= 0) {
                user.favourites.splice(index, 1)
            } else {
                user.favourites.push(placeId)
            }

            await user.save()
        })()
    },


    listFavourites(userId) {
        validate([
            { key: 'userId', value: userId, type: String },
        ])

        return (async () => {
            let user = await User.findById(userId).populate('favourites').lean().exec()

            if (!user) throw new NotFoundError(`user does not exist`)

            const promises = user.favourites.map(async fav => {
                const pictures = await Picture.find({ placeId: fav._id })

                if (pictures.length === 0) {
                    const picture = "https://res.cloudinary.com/dancing890/image/upload/v1542807002/waxfi0xtcm5u48yltzxc.png"

                    fav.picture = picture
                } else {
                    const picture = pictures[Math.floor(Math.random() * pictures.length)]

                    fav.picture = picture.url
                }

                fav.placeId = fav._id.toString()

                delete fav._id

                return fav
            })
            let listFavourites = await Promise.all(promises)

            return listFavourites.map(({ placeId, name, scoring, address, picture }) => ({ placeId, name, scoring, address, picture }))
        })()

    },

    uploadCheckIns(userId, placeId) {
        validate([
            { key: 'userId', value: userId, type: String },
            { key: 'placeId', value: placeId, type: String },

        ])

        return (async () => {
            let user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user does not exist`)

            let place = await Place.findById(placeId)

            if (!place) throw new NotFoundError(`place does not exist`)

            const index = user.checkIns.findIndex(check => check.toString() === placeId)

            if (index >= 0) {
                user.checkIns.splice(index, 1)
            } else {
                user.checkIns.push(placeId)
            }

            await user.save()
        })()
    },

    listCheckIns(userId) {
        validate([
            { key: 'userId', value: userId, type: String },
        ])
        return (async () => {
            let user = await User.findById(userId).populate('checkIns').lean().exec()

            if (!user) throw new NotFoundError(`user does not exist`)

            let promises = user.checkIns.map(async check => {
                debugger
                let pictures = await Picture.find({ placeId: check._id })

                if (pictures.length === 0) {
                    const picture = "https://res.cloudinary.com/dancing890/image/upload/v1542807002/waxfi0xtcm5u48yltzxc.png"

                    check.picture = picture
                } else {
                    const picture = pictures[Math.floor(Math.random() * pictures.length)]

                    check.picture = picture.url
                }

                check.placeId = check._id.toString()

                delete check._id

                return check
            })

            let listCheckIns = await Promise.all(promises)

            return listCheckIns.map(({ placeId, name, scoring, address, picture }) => ({ placeId, name, scoring, address, picture }))
        })()
    },

}

module.exports = logic