module.exports = function checkRole(...roles) {
    return function (req, res, next) {
        console.log("🔹 checkRoleMiddleware: проверяем роль...");
        console.log("ℹ️ Пользователь:", req.user);

        if (!req.user) {
            console.log("❌ Пользователь не найден в req.user");
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!roles.includes(req.user.role)) {
            console.log(
                `❌ Недостаточно прав: ${
                    req.user.role
                } не входит в [${roles.join(", ")}]`
            );
            return res.status(403).json({ error: "Forbidden" });
        }

        console.log("✅ Доступ разрешен");
        next();
    };
};
