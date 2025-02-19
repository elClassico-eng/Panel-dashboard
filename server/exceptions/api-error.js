module.exports = class ApiError extends Error {
    status;
    error;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, "Unauthorized");
    }

    static BadRequest(message) {
        return new ApiError(400, message);
    }

    static BadRequestError(message, errors = []) {
        return new ApiError(400, message, errors);
    }

    static InternalServerError(message = "Internal Server Error") {
        return new ApiError(500, message);
    }
};
