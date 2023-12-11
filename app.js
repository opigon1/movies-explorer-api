const express = require("express");
const mongoose = require("mongoose");
const { celebrate, Joi, errors } = require("celebrate");
const cookieParser = require("cookie-parser");
const { login, createUser, logout } = require("./controllers/users");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errors");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const NOT_FOUND = require("./utils/errors/NOT_FOUND");

const { PORT = 3000, DB_URL = "mongodb://127.0.0.1:27017/diplomdb" } =
  process.env;

const app = express();
mongoose
  .connect(DB_URL)
  .then(() => console.log("Connect!"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(requestLogger);
app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(), //.email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser
);
app.use(auth);
app.use("/users", require("./routes/users"));
app.use("/movies", require("./routes/movies"));
app.post("/signout", logout);

app.use("*", (req, res, next) => {
  return next(new NOT_FOUND("Страница не найдена"));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
