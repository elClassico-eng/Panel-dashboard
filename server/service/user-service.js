const UserModal = require("../models/user-models");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

class UserService {
    async registration(
        email,
        password,
        firstName,
        lastName,
        city,
        teamStatus,
        phoneNumber,
        profilePhoto
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
                city,
                teamStatus,
                phoneNumber,
                profilePhoto,
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
        const user = await UserModal.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw ApiError.BadRequestError("Incorrect email or password");
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({ ...userDto });
        await tokenService.saveTokens(userDto.id, tokens.refreshToken); // save tokens to the database

        return { ...tokens, user: userDto };
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
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
    }

    async getAllUsers() {
        const users = await UserModal.find();
        return users.map((user) => new UserDto(user));
    }

    async updateProfile(userId, updatedUser) {
        try {
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
}

module.exports = new UserService();
