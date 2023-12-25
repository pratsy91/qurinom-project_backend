import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signup = (req, res, next) => {
  const { name, email, password, isAdmin } = req.body;
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) {
        return res.json({ message: "Unable to create new user" });
      }
      User.create({ name, email, password: hash, isAdmin })
        .then(() => {
          return res
            .status(201)
            .json({ message: "Successfuly create new user" });
        })
        .catch((err) => {
          res.status(403).json(err);
        });
    });
  });
};

function generateToken(id) {
  return jwt.sign({ id }, process.env.TOKEN_SECRET);
}

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findAll({ where: { email } }).then((user) => {
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, function (err, response) {
        if (err) {
          console.log(err);
          return res.json({ success: false, message: "Something went wrong" });
        }
        if (response) {
          console.log(JSON.stringify(user));
          const jwttoken = generateToken(user[0].id);
          res.json({
            token: jwttoken,
            success: true,
            message: "Successfully Logged In",
          });
        } else {
          return res
            .status(401)
            .json({ success: false, message: "passwords do not match" });
        }
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "passwords do not match" });
    }
  });
};

export { signup, login, generateToken };
