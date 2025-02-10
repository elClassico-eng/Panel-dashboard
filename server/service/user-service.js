const UserModal = require("../models/user-models");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");

class UserService {
    async registration(email, password) {
        try {
            const candidate = await UserModal.findOne({ email });
            if (candidate) {
                throw new Error("User already exists");
            }
            const hashPassword = await bcrypt.hash(password, 3);
            const activationLink = uuid.v4();

            const user = await UserModal.create({
                email,
                password: hashPassword,
                activationLink,
            });
            await mailService.sendActivationMail(
                user.email,
                `${process.env.API_URL}/api/activate/${activationLink}`
            );

            const userDto = new UserDto(user); // create a new instance of the UserDto class
            const tokens = tokenService.generateToken({ ...userDto }); // generate tokens

            if (!tokens || !tokens.refreshToken) {
                throw new Error("Failed to generate refresh token");
            }

            await tokenService.saveTokens(userDto.id, tokens.refreshToken); // save tokens to the database

            return { ...tokens, user: userDto };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async activate(activationLink) {
        const user = await UserModal.findOne({ activationLink });
        if (!user) {
            throw new Error("Incorrect activation link");
        }
        user.isActivated = true;
        await user.save();
    }
}

module.exports = new UserService();
