//The ApiError class is mainly for custom errors, but it's not necessarily used for all normal (built-in) errors.
//its just the wrapper or the shell

class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        statck = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (statck) {
            this.stack = statck
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}