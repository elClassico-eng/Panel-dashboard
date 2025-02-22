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

            const { email, password, firstName, lastName, profilePhoto, role } =
                req.body;

            const existingAdmins = await userService.getAdminsCount();
            console.log("Existing admins:", existingAdmins);
            const assignedRole =
                existingAdmins === 0 ? "Admin" : role || "Employee";

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
                profilePhoto,
                assignedRole
            );

            console.log("Сохраненная роль пользователя:", userData.role);

            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            return res.status(201).json(userData);
        } catch (error) {
            next(error);
        }
    }

    /* Work currently ! */
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const userData = await userService.login(email, password);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            return res.status(201).json(userData);
        } catch (error) {
            if (
                error.message === "User not found" ||
                error.message === "Invalid password"
            ) {
                return res.status(401).json({
                    success: false,
                    message: error.message,
                    data: null,
                });
            }

            next(error);
        }
    }

    /* Work currently ! */
    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            const token = await userService.logout(refreshToken);
            res.clearCookie("refreshToken");
            return res.status(201).json(token);
        } catch (error) {
            next(error);
        }
    }

    /* Work currently ! */
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            return res.status(201).json(userData);
        } catch (error) {
            next(error);
        }
    }

    async getUsers(req, res, next) {
        try {
            console.log("User Data:", req.user);

            if (!req.user || req.user.role !== "Admin") {
                console.log("Access denied. User role:", req.user?.role);
                return next(ApiError.Forbidden("Access denied"));
            }

            const users = await userService.getAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const { firstName, lastName, role } = req.body;

            if (role || email) {
                return next(
                    ApiError.BadRequestError(
                        "You can't update email or role. Only first name and last name are allowed. Please check your request."
                    )
                );
            }

            const updateUser = await userService.updateProfile(userId, {
                firstName,
                lastName,
            });

            return res.status(201).json(updateUser);
        } catch (updateProfileError) {
            next(updateProfileError);
        }
    }

    /* Work currently ! */
    async getProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const userProfile = await userService.getProfile(userId);

            return res.status(201).json(userProfile);
        } catch (getProfileError) {
            next(getProfileError);
        }
    }

    async updateRole(req, res, next) {
        try {
            const adminId = req.user.id;
            const { userId, newRole } = req.body;

            if (!["Employee", "Manager", "Admin"].includes(newRole)) {
                return next(ApiError.BadRequestError("Invalid role"));
            }

            const adminUser = await userService.getProfile(adminId);
            if (adminUser.role !== "Admin" && adminUser.role !== "Manager") {
                return next(ApiError.Forbidden("Access denied"));
            }

            const updatedUser = await userService.updateProfile(userId, {
                role: newRole,
            });

            return res.status(201).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
