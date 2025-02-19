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
                throw ApiError.BadRequestError("User already exists");
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
                    "Failed to generate refresh token"
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

            if (!user) {
                throw ApiError.BadRequestError("User not found");
            }

            if (!isPassValid) {
                throw ApiError.BadRequestError("Incorrect password");
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
            console.error("Invalid refresh token:", error);
            throw error;
        }
    }

    async refresh(refreshToken) {
        try {
            if (!refreshToken) {
                throw ApiError.UnauthorizedError("User is not authorized");
            }
            const userData = tokenService.validateRefreshToken(refreshToken);
            const tokenFromDb = await tokenService.findToken(refreshToken);

            if (!userData || !tokenFromDb) {
                throw ApiError.UnauthorizedError("User is not authorized");
            }

            const user = await UserModal.findById(userData.id);
            const userDto = new UserDto(user);
            const tokens = tokenService.generateToken({ ...userDto });

            await tokenService.saveTokens(userDto.id, tokens.refreshToken); // save tokens to the database

            return { ...tokens, user: userDto };
        } catch (errorRefresh) {
            console.error("Invalid refresh token:", errorRefresh);
            throw errorRefresh;
        }
    }

    async getAllUsers(userRole) {
        try {
            if (!userRole) {
                throw ApiError.BadRequestError("User role is required");
            }

            if (userRole !== "Admin" && userRole !== "Manager") {
                throw ApiError.BadRequestError("Invalid user role");
            }

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
                throw ApiError.BadRequestError("User not found");
            }

            return new UserDto(user);
        } catch (error) {
            console.log(error);
            throw ApiError.InternalServerError("Failed to update profile");
        }
    }

    async getProfile(userId) {
        try {
            const user = await UserModal.findById(userId);

            if (!user) {
                throw ApiError.BadRequestError("User not found");
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
                role: "Admin",
            });
            console.log("Количество администраторов в базе:", adminsCount);

            return adminsCount;
        } catch (error) {
            console.log(error);
            throw ApiError.InternalServerError("Failed to get admins count");
        }
    }
}

module.exports = new UserService();
