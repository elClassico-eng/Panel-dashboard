const rateLimit = require('express-rate-limit');

// General rate limit for all routes
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Слишком много запросов с этого IP, попробуйте позже.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict rate limit for authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts per windowMs
    message: {
        error: 'Слишком много попыток входа, попробуйте позже.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
});

// Rate limit for registration
const registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 registration attempts per hour
    message: {
        error: 'Слишком много попыток регистрации, попробуйте позже.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limit for task creation
const taskCreationLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 task creations per minute
    message: {
        error: 'Слишком много создаваемых задач, попробуйте позже.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    generalLimiter,
    authLimiter,
    registrationLimiter,
    taskCreationLimiter,
};