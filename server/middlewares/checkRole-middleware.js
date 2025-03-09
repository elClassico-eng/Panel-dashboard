const tokenService = require("../service/token-service");

module.exports = function (role) {
    return function (req, res, next) {
        try {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            if (
                !authorizationHeader ||
                !authorizationHeader.startsWith("Bearer ")
            ) {
                return res
                    .status(401)
                    .json({ error: "Invalid authorization header" });
            }

            const accessToken = authorizationHeader.split(" ")[1];
            if (!accessToken) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const userData = tokenService.validateAccessToken(accessToken);

            if (!userData) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            console.log("✅ Декодированный токен:", userData);

            if (userData?.role !== role) {
                return res.status(403).json({ error: "No access" });
            }

            req.user = userData;
            next();
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    };
};
