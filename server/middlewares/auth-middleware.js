const tokenService = require("../service/token-service");

module.exports = function (req, res, next) {
    try {
        console.log("🔹 authMiddleware: проверяем заголовки...");
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            console.log("❌ Нет заголовка Authorization");
            return res.status(401).json({ error: "Unauthorized" });
        }

        const accessToken = authorizationHeader.split(" ")[1];
        if (!accessToken) {
            console.log("❌ Токен отсутствует");
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userData = tokenService.validateAccessToken(accessToken);
        console.log("✅ Декодированный токен:", userData);

        if (!userData) {
            console.log("❌ Токен недействителен");
            return res.status(401).json({ error: "Unauthorized" });
        }

        req.user = userData;
        next();
    } catch (error) {
        console.log("❌ Ошибка в authMiddleware:", error.message);
        return res.status(400).json({ error: error.message });
    }
};
