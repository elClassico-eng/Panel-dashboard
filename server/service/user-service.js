const UserModal = require("../models/user-models");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

class UserService {
    async registration(email, password) {
        try {
            const candidate = await UserModal.findOne({ email });
            if (candidate) {
                throw ApiError.BadRequestError("User already exists");
            }
            const hashPassword = await bcrypt.hash(password, 3);

            const user = await UserModal.create({
                email,
                password: hashPassword,
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
}

module.exports = new UserService();
