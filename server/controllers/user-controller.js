const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequestError("Ошибка валидации", errors.array())
                );
            }

            const { email, password, firstName, lastName, profilePhoto, role } =
                req.body;

            const existingAdmins = await userService.getAdminsCount();
            const assignedRole =
                existingAdmins === 0
                    ? "Руководитель проекта"
                    : role || "Студент";

            if (!email || !password) {
                return res
                    .status(400)
                    .json({ message: "Отсутствует логин или пароль" });
            }

            const userData = await userService.registration(
                email,
                password,
                firstName,
                lastName,
                profilePhoto,
                assignedRole
            );

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
            if (error.message === "Неверный логин или пароль") {
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

            if (!req.user || req.user.role !== "Руководитель проекта") {
                return next(ApiError.Forbidden("Access denied"));
            }

            const users = await userService.getAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            console.error(
                "Ошибка при получении данных о пользователях:",
                error
            );
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const { firstName, lastName, role, email } = req.body;

            if (role || email) {
                return next(
                    ApiError.BadRequestError(
                        "Вы не можете обновить email или роль. Разрешено изменять только имя и фамилию. Пожалуйста, проверьте ваш запрос."
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
            const managerId = req.user.id;
            const { userId, newRole } = req.body;

            if (
                !["Руководитель проекта", "Преподаватель", "Студент"].includes(
                    newRole
                )
            ) {
                return next(ApiError.BadRequestError("Неверная роль"));
            }

            const managerUser = await userService.getProfile(managerId);
            if (
                managerUser.role !== "Руководитель проекта" &&
                managerUser.role !== "Преподаватель"
            ) {
                return next(ApiError.Forbidden("Доступ запрещен"));
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
