require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB_URL } = require('./utils/config');

const { PORT } = process.env;
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
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(requestLogger);

app.use(require('./middlewares/rateLimited'));
app.use(require('./routes/index'));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT);
