const { celebrate, Joi } = require('celebrate');
const { httpsRegex } = require('./regex/httpsRegex');

const createMovieValidation = celebrate({
  body: Joi.object({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().uri().regex(httpsRegex),
    trailerLink: Joi.string().required().uri().regex(httpsRegex),
    thumbnail: Joi.string().required().uri().regex(httpsRegex),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});
const deleteMovieByIdValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const signupValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required(),
  }),
});

module.exports = {
  updateUserValidation,
  signupValidation,
  signinValidation,
  deleteMovieByIdValidation,
  createMovieValidation,
};
