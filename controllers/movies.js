const Movie = require("../models/movie");
const BAD_REQUEST = require("../utils/errors/BAD_REQUEST");
const NOT_FOUND = require("../utils/errors/NOT_FOUND");

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    owner: req.user._id,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BAD_REQUEST("Переданы некорректные данные"));
      }
      return next(err);
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send({ data: movie }))
    .catch((err) => next(err));
};

module.exports.deleteMovieById = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NOT_FOUND("Фильм не найден"));
      }

      if (movie.owner.toString() !== req.user._id) {
        return next(new FORBIDDEN("Нет доступа"));
      } else {
        Movie.findByIdAndDelete(movieId).then(() => {
          res.status(200).send(movie);
        });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BAD_REQUEST("Переданы некорректные данные при удалении фильма.")
        );
      } else {
        return next(err);
      }
    });
};
