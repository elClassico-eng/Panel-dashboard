const UserModal = require("../models/user-models");
const bcrypt = require("bcrypt");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

class UserService {
    async registration(
        email,
        password,
        firstName,
        lastName,
        profilePhoto,
        role
    ) {
        try {
            const candidate = await UserModal.findOne({ email });
            if (candidate) {
                throw ApiError.BadRequestError(
                    `Пользователь с email ${candidate} уже зарегистрирован!`
                );
            }
            const hashPassword = await bcrypt.hash(password, 3);

            const user = await UserModal.create({
                email,
                password: hashPassword,
                firstName,
                lastName,
                profilePhoto,
                role,
            });

            const userDto = new UserDto(user); // create a new instance of the UserDto class
            const tokens = tokenService.generateToken({ ...userDto }); // generate tokens

            if (!tokens || !tokens.refreshToken) {
                throw ApiError.BadRequestError(
                    "Ошибка при создании refresh-токена"
                );
            }

            await tokenService.saveTokens(userDto.id, tokens.refreshToken); // save tokens to the database

            return { ...tokens, user: userDto };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async login(email, password) {
        try {
            const user = await UserModal.findOne({ email });
            const isPassValid = await bcrypt.compare(password, user.password);

            if (!user || !isPassValid) {
                throw ApiError.BadRequestError("Неверный логин или пароль.");
            }

            const userDto = new UserDto(user);
            const tokens = tokenService.generateToken({ ...userDto });
            await tokenService.saveTokens(userDto.id, tokens.refreshToken); // save tokens to the database

            return { ...tokens, user: userDto };
        } catch (errorLogin) {
            console.error("Invalid login credentials:", errorLogin);
            throw errorLogin;
        }
    }

    async logout(refreshToken) {
        try {
            const token = await tokenService.removeToken(refreshToken);
            return token;
        } catch (error) {
            console.error("Ошибка refresh-токена", error);
            throw error;
        }
    }

    async refresh(refreshToken) {
        try {
            if (!refreshToken) {
                throw ApiError.UnauthorizedError("Пользователь не авторизован");
            }
            const userData = tokenService.validateRefreshToken(refreshToken);
            const tokenFromDb = await tokenService.findToken(refreshToken);

            if (!userData || !tokenFromDb) {
                throw ApiError.UnauthorizedError("Пользователь не авторизован");
            }

            const user = await UserModal.findById(userData.id);
            const userDto = new UserDto(user);
            const tokens = tokenService.generateToken({ ...userDto });

            await tokenService.saveTokens(userDto.id, tokens.refreshToken); // save tokens to the database

            return { ...tokens, user: userDto };
        } catch (errorRefresh) {
            console.error("Ошибка refresh-токена", errorRefresh);
            throw errorRefresh;
        }
    }

    async getAllUsers(reqUserRole) {
        try {
            const users = await UserModal.find();
            return users.map((user) => new UserDto(user));
        } catch (errorAllUsers) {
            console.log("Failed to get all users: ", errorAllUsers);
            throw errorAllUsers;
        }
    }

    async updateProfile(userId, updatedUser) {
        try {
            delete updatedUser.email;
            delete updatedUser.role;

            const user = await UserModal.findByIdAndUpdate(
                userId,
                updatedUser,
                {
                    new: true,
                    runValidators: true,
                }
            );

            if (!user) {
                throw ApiError.BadRequestError("Пользователь не найден");
            }

            return new UserDto(user);
        } catch (error) {
            console.log(error);
            throw ApiError.InternalServerError("Ошибка при изменении профиля");
        }
    }

    async getProfile(userId) {
        try {
            const user = await UserModal.findById(userId);

            if (!user) {
                throw ApiError.BadRequestError("Пользователь не найден");
            }

            return new UserDto(user);
        } catch (error) {
            console.log(error);
        }
    }

    async getAdminsCount() {
        try {
            // Получаем общее количество пользователей
            const totalCount = await UserModal.countDocuments();
            console.log("Всего пользователей в базе:", totalCount);

            // Получаем количество администраторов
            const adminsCount = await UserModal.countDocuments({
                role: "Руководитель проекта",
            });
            console.log("Количество администраторов в базе:", adminsCount);

            return adminsCount;
        } catch (error) {
            console.log(error);
            throw ApiError.InternalServerError(
                "Ошибка при получении количества администраторов"
            );
        }
    }
}

module.exports = new UserService();
