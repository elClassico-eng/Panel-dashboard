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


        return { accessToken, refreshToken };
    }

    validateAccessToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return decoded;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return null;
            }
            if (error.name === 'JsonWebTokenError') {
                return null;
            }
            throw error;
        }
    }

    validateRefreshToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return decoded;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return null;
            }
            if (error.name === 'JsonWebTokenError') {
                return null;
            }
            throw error;
        }
    }

    findToken(refreshToken) {
        return tokenModel.findOne({ refreshToken });
    }

    async saveTokens(userId, refreshToken) {
        try {
            const result = await tokenModel.findOneAndUpdate(
                { user: userId },
                { refreshToken, updatedAt: new Date() },
                { 
                    upsert: true, 
                    new: true,
                    runValidators: true 
                }
            );
            return result;
        } catch (error) {
            if (error.code === 11000) {
                const existingToken = await tokenModel.findOne({ user: userId });
                if (existingToken) {
                    existingToken.refreshToken = refreshToken;
                    existingToken.updatedAt = new Date();
                    return await existingToken.save();
                }
            }
            throw error;
        }
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({ refreshToken });
        return tokenData;
    }
}

module.exports = new TokenService();
