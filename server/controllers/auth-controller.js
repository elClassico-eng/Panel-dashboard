const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const { validationResult } = require("express-validator");

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles,
    };
    const accessToken = jwt.sign(payload, secret, {
        expiresIn: "1h",
    });
    return accessToken;
};

class authController {
    async registration(req, res) {
        // Registration logic
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: "Error during registration",
                    errors: errors.array(),
                });
            }

            const { email, username, password, firstName, lastName } = req.body;
            const candidate = await User.findOne({ email });

            if (candidate) {
                return res
                    .status(400)
                    .json({ message: "Email already exists" });
            }

            const userRole = await Role.findOne({ value: "Employees" });
            const hashPassword = bcrypt.hashSync(password, 7);
            const user = new User({
                username,
                email,
                firstName,
                lastName,
                password: hashPassword,
                roles: [userRole.value],
            });
            await user.save();

            return res
                .status(200)
                .json({ message: "User success registration ✔", user });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "Registration error ❌" });
        }
    }

    async login(req, res) {
        // Login logic
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                    .json({ message: `User with ${email} not found` });
            }

            const isMatch = bcrypt.compareSync(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: "Incorrect password" });
            }

            const token = generateAccessToken(user._id, user.roles);

            return res.json({ message: "User logged in successfully", token });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "Login error" });
        }
    }

    async getUsers(req, res) {
        // Get users logic
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "Registration error" });
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie("token");
            return res.json({ message: "User logged out successfully" });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "Logout error" });
        }
    }

    async getUserById(req, res) {
        try {
            if (!req.params.id)
                return res.status(400).json({ message: "User ID is required" });

            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    async updateUser(req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: "Error during update",
                    errors: errors.array(),
                });
            }

            if (!req.body || Object.keys(req.body).length === 0)
                return res.status(400).json({ message: "No data to update" });

            const user = await User.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    async deleteUser(req, res) {
        try {
            if (!req.params.id)
                return res.status(400).json({ message: "User ID is required" });

            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json({ message: "User deleted successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = new authController();
