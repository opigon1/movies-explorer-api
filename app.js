require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { login, createUser, logout } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NOT_FOUND = require('./utils/errors/NOT_FOUND');

const { PORT = 3000, DB_URL } = process.env;

const app = express();
mongoose.connect(DB_URL);

app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:3001',
      'https://movie.diplom.nomoredomainsmonster.ru',
      'http://movie.diplom.nomoredomainsmonster.ru',
      'http://localhost:3000',
    ],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(requestLogger);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);
app.use(auth);
app.use(require('./routes/users'));
app.use(require('./routes/movies'));

app.post('/signout', logout);

app.use('*', (req, res, next) => next(new NOT_FOUND('Страница не найдена')));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
