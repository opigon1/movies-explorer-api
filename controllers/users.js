const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const BAD_REQUEST = require("../utils/errors/BAD_REQUEST");
const NOT_FOUND = require("../utils/errors/NOT_FOUND");
const CONFLICT = require("../utils/errors/CONFLICT");
const UNAUTHORIZED = require("../utils/errors/UNAUTHORIZED");
const { JWT_SECRET, NODE_ENV } = process.env;

module.exports.getUserinfo = (req, res, next) => {
  debugger;
  User.findById(req.user._id)
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findOneAndUpdate(
    { _id: req.user._id },
    { name, email },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return next(new NOT_FOUND("Пользователь с указанным _id не найден."));
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new BAD_REQUEST(
            "Переданы некорректные данные при обновлении пользователя"
          )
        );
      } else {
        return next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))

    .then((user) =>
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
      })
    )
    .catch((err) => {
      if (err.code == 11000) {
        return next(new CONFLICT("Такой пользователь уже существует"));
      }
      if (err.name === "ValidationError") {
        return next(
          new BAD_REQUEST(
            "Переданы некорректные данные при создании пользователя"
          )
        );
      } else {
        return next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return next(new UNAUTHORIZED("Передан неккоректный пароль"));
        }
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
          {
            expiresIn: "7d",
          }
        );
        res
          .cookie("jwt", token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 3600000 * 24 * 7,
          })
          .status(200)
          .send({
            message: "Аутентификация прошла успешно",
          });
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new BAD_REQUEST("Поле email или password не должны быть пустыми")
        );
      } else {
        return next(new UNAUTHORIZED("Передан неккоректный email или пароль"));
      }
      next(err);
    });
};

module.exports.logout = (req, res, next) => {
  res.clearCookie("jwt").status(200).send({ message: "Успешно" });

  if (res.status !== 200) {
    return next(err);
  }
};
