const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token-model");

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: "30m",
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: "30d",
        });

        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);

        return { accessToken, refreshToken };
    }

    validateAccessToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return decoded;
        } catch (error) {
            console.error("Invalid access token:", error);
            throw error;
        }
    }

    validateRefreshToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return decoded;
        } catch (error) {
            console.error("Invalid refresh token:", error);
            throw error;
        }
    }

    findToken(refreshToken) {
        return tokenModel.findOne({ refreshToken });
    }

    async saveTokens(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({ user: userId, refreshToken });
        console.log("Creating new token:", token);
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({ refreshToken });
        return tokenData;
    }
}

module.exports = new TokenService();
