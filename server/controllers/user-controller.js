const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequestError("Validation error", errors.array())
                );
            }
            const { email, password } = req.body;

            if (!email || !password) {
                return res
                    .status(400)
                    .json({ message: "Missing email or password" });
            }

            const userData = await userService.registration(email, password);

            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
        } catch (error) {
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
        } catch (error) {
            next(error);
        }
    }

    async getUsers(req, res, next) {
        try {
            res.json([
                { id: 1, name: "John Doe" },
                { id: 2, name: "Jane Doe" },
            ]);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
