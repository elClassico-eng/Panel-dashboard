const userService = require("../service/user-service");

class UserController {
    async registration(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res
                    .status(400)
                    .json({ message: "Missing email or password" });
            }

            const userData = await userService.registration(email, password);

            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            return res.json(userData);
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ message: "Registration failed", error: error.message });
        }
    }

    async login(req, res, next) {
        try {
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
        } catch (error) {
            next(error);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (error) {
            console.error(error);
        }
    }

    async refresh(req, res, next) {
        try {
        } catch (error) {
            next(error);
        }
    }

    async getUsers(req, res, next) {
        try {
            res.json([
                { id: 1, name: "John Doe" },
                { id: 2, name: "Jane Doe" },
            ]);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
