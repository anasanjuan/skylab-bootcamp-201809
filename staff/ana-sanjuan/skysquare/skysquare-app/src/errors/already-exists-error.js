class AlreadyExistsError extends Error {
    constructor(message, extra) {
        super()

        Error.captureStackTrace(this, this.constructor)

        this.name = 'AlreadyExistsError'
        this.message = message

        if (extra) this.extra = extra
    }
}

export default AlreadyExistsError
// module.exports = AlreadyExistsError