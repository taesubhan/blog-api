function catchErrors(err, req, res, next) {
    res.status(err.statusCode || 500).json({error_message: err.message});
};

class CustomNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
        this.name = "NotFoundError";
    }
};

class CustomInternalServerError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 500;
        this.name = "InternalServerError";
    }
};

class CustomAuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 401;
        this.name = "AuthenticationError";
    }
};

module.exports = {
    catchErrors,
    CustomNotFoundError,
    CustomInternalServerError,
    CustomAuthenticationError
}