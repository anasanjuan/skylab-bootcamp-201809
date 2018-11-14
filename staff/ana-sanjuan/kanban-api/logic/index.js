const { User, Postit } = require('../data')
const { AlreadyExistsError, AuthError, NotFoundError, ValueError } = require('../errors')

const logic = {
    registerUser(name, surname, username, password) {
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof surname !== 'string') throw TypeError(`${surname} is not a string`)
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!name.trim()) throw new ValueError('name is empty or blank')
        if (!surname.trim()) throw new ValueError('surname is empty or blank')
        if (!username.trim()) throw new ValueError('username is empty or blank')
        if (!password.trim()) throw new ValueError('password is empty or blank')

        return (async () => {
            let user = await User.findOne({ username })

            if (user) throw new AlreadyExistsError(`username ${username} already registered`)

            user = new User({ name, surname, username, password })

            await user.save()
        })()
    },

    authenticateUser(username, password) {
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!username.trim()) throw new ValueError('username is empty or blank')
        if (!password.trim()) throw new ValueError('password is empty or blank')

        return (async () => {
            const user = await User.findOne({ username })
            if (!user || user.password !== password) throw new AuthError('invalid username or password')

            const id = user.id

            return id
        })()
    },

    retrieveUser(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)

        if (!id.trim().length) throw new ValueError('id is empty or blank')

        return (async () => {
            const user = await User.findById(id, { '_id': 0, password: 0, postits: 0, __v: 0 }).lean()

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            user.id = id

            return user
        })()
    },

    updateUser(id, name, surname, username, newPassword, password) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (name != null && typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (surname != null && typeof surname !== 'string') throw TypeError(`${surname} is not a string`)
        if (username != null && typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (newPassword != null && typeof newPassword !== 'string') throw TypeError(`${newPassword} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!id.trim().length) throw new ValueError('id is empty or blank')
        if (name != null && !name.trim().length) throw new ValueError('name is empty or blank')
        if (surname != null && !surname.trim().length) throw new ValueError('surname is empty or blank')
        if (username != null && !username.trim().length) throw new ValueError('username is empty or blank')
        if (newPassword != null && !newPassword.trim().length) throw new ValueError('newPassword is empty or blank')
        if (!password.trim().length) throw new ValueError('password is empty or blank')

        return (async () => {
            let user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            if (user.password !== password) throw new AuthError('invalid password')

            if (username) {
                const _user = await User.findOne({ username })

                if (_user) throw new AlreadyExistsError(`username ${username} already exists`)

                name != null && (user.name = name)
                surname != null && (user.surname = surname)
                user.username = username
                newPassword != null && (user.password = newPassword)

                await user.save()
            } else {
                name != null && (user.name = name)
                surname != null && (user.surname = surname)
                newPassword != null && (user.password = newPassword)

                await user.save()
            }
        })()
    },

    addBuddy(id, buddyUsername) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim().length) throw new ValueError('id is empty or blank')

        if (typeof buddyUsername !== 'string') throw TypeError(`${buddyUsername} is not a string`)
        if (!buddyUsername.trim().length) throw new ValueError('buddy Username is empty or blank')

        return (async () => {
            debugger
            const user = await User.findById(id)

            const buddy = await User.findOne({ username: buddyUsername })

            if (!user) throw new NotFoundError(`user with id ${id} not found`)
            
            user.buddies.push(buddy.id)

            await user.save()
        })()
    },

    listBuddies(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim().length) throw new ValueError('id is empty or blank')

        return (async () => {
            const user = await User.findById(id)
            
            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const buddies = user.buddies

            if (!buddies) return []

            let promises = []

            for (var i = 0; i < user.buddies.length; i++) {
                promises.push(User.findById(user.buddies[i]))
            }

            return Promise.all(promises)
                .then(__buddies => __buddies.map(buddy=> buddy.username))
        })()

    },

    /**
     * Adds a postit
     * 
     * @param {string} id The user id
     * @param {string} text The postit text
     * 
     * @throws {TypeError} On non-string user id, or non-string postit text
     * @throws {Error} On empty or blank user id or postit text
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong user id
     */
    addPostit(id, text, status) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim().length) throw new ValueError('id is empty or blank')

        if (typeof text !== 'string') throw TypeError(`${text} is not a string`)
        if (!text.trim().length) throw new ValueError('text is empty or blank')

        return (async () => {
            const user = await User.findById(id)
            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const postit = new Postit({ text, status, user: id })

            await postit.save()
        })()
    },

    listPostits(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim().length) throw new ValueError('id is empty or blank')

        return (async () => {
            let user = await User.findById(id).lean()
            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const postits = await Postit.find( {$or :[ {user: user._id },{ assignTo: id }]}, { __v: 0 }).lean()

            const _postits = postits.map(postit => {
                postit.id = postit._id.toString()

                delete postit._id

                postit.user = postit.user.toString()

                return postit
            })
            return _postits
        })()
    },

    /**
     * Removes a postit
     * 
     * @param {string} id The user id
     * @param {string} postitId The postit id
     * 
     * @throws {TypeError} On non-string user id, or non-string postit id
     * @throws {Error} On empty or blank user id or postit text
     * 
     * @returns {Promise} Resolves on correct data, rejects on wrong user id, or postit id
     */
    removePostit(id, postitId) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim().length) throw new ValueError('id is empty or blank')

        if (typeof postitId !== 'string') throw TypeError(`${postitId} is not a string`)
        if (!postitId.trim().length) throw new ValueError('postit id is empty or blank')

        return (async () => {
            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const postit = await Postit.findOne({ user: id, _id: postitId })

            if (!postit) throw new NotFoundError(`postit with id ${postitId} does not exist`)

            await postit.remove()
        })()
    },

    modifyPostit(id, postitId, text) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim().length) throw new ValueError('id is empty or blank')

        if (typeof postitId !== 'string') throw TypeError(`${postitId} is not a string`)
        if (!postitId.trim().length) throw new ValueError('postit id is empty or blank')

        if (typeof text !== 'string') throw TypeError(`${text} is not a string`)
        if (!text.trim().length) throw new ValueError('text is empty or blank')

        return (async () => {
            const user = await User.findById(id)
            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const postit = await Postit.findOne({ user: id, _id: postitId })

            if (!postit) throw new NotFoundError(`postit with id ${postitId} not found in user with id ${id}`)

            postit.text = text

            await postit.save()
        })()
    },

    modifyPostitStatus(id, postitId, status) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim().length) throw new ValueError('id is empty or blank')

        if (typeof postitId !== 'string') throw TypeError(`${postitId} is not a string`)
        if (!postitId.trim().length) throw new ValueError('postit id is empty or blank')

        if (typeof status !== 'string') throw TypeError(`${status} is not a string`)
        if (!status.trim().length) throw new ValueError('status is empty or blank')

        return (async () => {

            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const postit = await Postit.findOne({ user: id, _id: postitId })

            if (!postit) throw new NotFoundError(`postit with id ${postitId} not found in user with id ${id}`)

            postit.status = status

            await postit.save()
        })()
    },
    
    assignBuddy(userId, buddyUsername, postitId) {
        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)
        if (!userId.trim().length) throw new ValueError('userId is empty or blank')

        if (typeof buddyUsername !== 'string') throw TypeError(`${buddyUsername} is not a string`)
        if (!buddyUsername.trim().length) throw new ValueError('buddyUsername is empty or blank')

        if (typeof postitId !== 'string') throw TypeError(`${postitId} is not a string`)
        if (!postitId.trim().length) throw new ValueError('postit id is empty or blank')

        return (async () => {
            const user = await User.findById(userId)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const postit = await Postit.findOne({ user: userId, _id: postitId })

            if (!postit) throw new NotFoundError(`postit with id ${postitId} not found in user with id ${userId}`)

            const buddy = await User.findOne({ username: buddyUsername })

            if (!buddy) throw new NotFoundError(`user with username ${buddyUsername} not found`)

            postit.assignTo = buddy.id

            await postit.save()
        })()
    }

}

module.exports = logic