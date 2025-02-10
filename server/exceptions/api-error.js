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

    static BadRequestError(message, errors = []) {
        return new ApiError(400, message, errors);
    }
};
