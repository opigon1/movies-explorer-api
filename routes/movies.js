const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createMovie,
  getMovies,
  deleteMovieById,
} = require('../controllers/movies');
const { httpsRegex } = require('../utils/regex/httpsRegex');

router.post('/movies', celebrate({
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
}), createMovie);
router.get('/movies', getMovies);
router.delete(
  '/movies/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24),
    }),
  }),
  deleteMovieById,
);

module.exports = router;
