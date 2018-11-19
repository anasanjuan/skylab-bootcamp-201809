class NotAllowedError extends Error {
    constructor(message, extra) {
        super()

        Error.captureStackTrace(this, this.constructor)

        this.name = 'NotAllowedError'
        this.message = message

        if (extra) this.extra = extra
    }
}

export default  NotAllowedError
// module.exports = NotAllowedError
