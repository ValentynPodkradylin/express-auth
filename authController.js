const User = require("./models/User");
const Role = require("./models/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("./config");

function generateAccessToken(id, roles) {
  const payload = {
    id,
    roles,
  };

  return jwt.sign(payload, secret, { expiresIn: "24h" });
}

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json(errors);
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким именем уже существует" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: "ADMIN" });
      const user = new User({
        username,
        password: hashPassword,
        roles: [userRole.value],
      });
      await user.save();
      return res.json({ message: "Пользователь успешно зарегистрирован" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error" + e });
    }
  }

  async logIn(req, res) {
    try {
      const { username, password } = req.body;
      console.log(username);
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json("Пользіваетль не найден");
      }
      const isValid = bcrypt.compareSync(password, user.password);

      if (!isValid) {
        return res.status(400).json({ message: "Пароль не валиден" });
      }
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration failed!" });
    }
  }
  async getUsers(req, res) {
    try {
      const users = await User.find({});
      res.json({ users });
    } catch (e) {}
  }
}

module.exports = new authController();
