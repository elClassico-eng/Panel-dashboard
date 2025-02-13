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

            const {
                email,
                password,
                firstName,
                lastName,
                city,
                teamStatus,
                phoneNumber,
            } = req.body;

            if (!email || !password) {
                return res
                    .status(400)
                    .json({ message: "Missing email or password" });
            }

            const userData = await userService.registration(
                email,
                password,
                firstName,
                lastName,
                city,
                teamStatus,
                phoneNumber
            );

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
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie("refreshToken");
            return res.json(token);
        } catch (error) {
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async getUsers(req, res, next) {
        try {
            return res.json(await userService.getAllUsers());
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const { firstName, lastName, city, teamStatus, phoneNumber } =
                req.body;

            const updateUser = await userService.updateProfile(userId, {
                firstName,
                lastName,
                city,
                teamStatus,
                phoneNumber,
            });
            return res.json(updateUser);
        } catch (updateProfileError) {
            next(updateProfileError);
        }
    }

    async getProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const userProfile = await userService.getProfile(userId);

            return res.json(userProfile);
        } catch (getProfileError) {
            next(getProfileError);
        }
    }

    async uploadAvatar(req, res, next) {
        try {
            const userId = req.body.id;
            const photoPath = req.file.path;

            const user = await userService.uploadAvatar(userId, {
                photo: photoPath,
            });
            return res.json(user);
        } catch (uploadAvatarError) {
            next(uploadAvatarError);
        }
    }
}

module.exports = new UserController();
