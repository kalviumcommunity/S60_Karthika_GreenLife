const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { check, validationResult } = require("express-validator");
const { UsersModel } = require("../mongoConnect");

const UserRoutes = express.Router();
dotenv.config();

const validationRules = [
    check("UserName", "Username is required").not().isEmpty(),
    check("Gmail", "Email is not valid").isEmail(),
    check("Password", "Enter password of 5 or more characters").isLength({ min: 5 }),
    check("role", "Role is required").not().isEmpty(),
];

const loginValidationRules = [
    check("Gmail", "Enter valid email").isEmail(),
    check("Password", "Password is required").exists(),
];
UserRoutes.post('/postuser', validationRules,async (req, res) => {
    const { UserName, Gmail, Password, role } = req.body;
  
    try {
      let user = await UsersModel.findOne({ Gmail });
  
      if (user) {
        let rolesArray = role.split(' ');
        let existingRoles = user.role.split(' ');
  
        rolesArray.forEach(r => {
          if (!existingRoles.includes(r)) {
            existingRoles.push(r);
          }
        });
  
        user.role = existingRoles.join(' ');
        if (Password) {
          const hashedPassword = await bcrypt.hash(Password, 10);
          user.password = hashedPassword;
        }
  
        console.log('Updating existing user:', user);
        await user.save();
      } else {
        const hashedPassword = await bcrypt.hash(Password, 10);
        user = new UsersModel({ UserName, Gmail, Password: hashedPassword, role: role.split(' ').join(' ') });
        console.log('Saving new user:', user);
        await user.save();
      }
  
      const payload = { user: { id: user.id, role: user.role } };
      jwt.sign(payload, 'yourJWTSecret', { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });


UserRoutes.post("/login", loginValidationRules, async (req, res) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        return res.status(400).json({ validationError: validationError.array() });
    }

    const { Gmail, Password } = req.body;
    try {
        let validUser = await UsersModel.findOne({ Gmail });
        if (!validUser) {
            return res.status(400).json({ note: "User details not found in database" });
        }

        const correctPassword = await bcrypt.compare(Password, validUser.Password);
        if (!correctPassword) {
            return res.status(400).json({ note: "Incorrect Password" });
        }

        const createPayload = { id: validUser.id, roles: validUser.roles };
        jwt.sign(createPayload, process.env.Secret_key, { expiresIn: "3600d" }, (error, jwtToken) => {
            if (error) {
                throw error;
            } else {
                res.json({ jwtToken });
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json("Server error in UserRoutes.js (login route error)");
    }
});

UserRoutes.get("/:id", async (req, res) => {
    try {
        const getUser = await UsersModel.findById(req.params.id).select("-Password");
        if (!getUser) {
            return res.status(404).json({ note: "User not found in database" });
        }
        res.json({ username: getUser.UserName, gmail: getUser.Gmail, roles: getUser.roles });
    } catch (error) {
        res.status(500).json({ note: "Specific user route error in server" });
    }
});

module.exports = UserRoutes;
