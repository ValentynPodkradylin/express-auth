const Router = require("express");
const authController = require("./authController");
const { check } = require("express-validator");
const middlewaree = require("./middlewaree/authMiddlewaree");
const router = new Router();

router.post(
  "/registration",
  [
    check("username", "Не может быть пустым").notEmpty(),
    check("password", "Больше 4 и меньше 10 символов").isLength({
      max: 10,
      min: 4,
    }),
  ],
  authController.registration
);
router.post("/login", authController.logIn);
router.get("/users", middlewaree, authController.getUsers);

module.exports = router;
