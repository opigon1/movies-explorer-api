const router = require('express').Router();
const { createMovieValidation, deleteMovieByIdValidation } = require('../utils/validation');
const {
  createMovie,
  getMovies,
  deleteMovieById,
} = require('../controllers/movies');

router.post('/', createMovieValidation, createMovie);
router.get('/', getMovies);
router.delete('/:movieId', deleteMovieByIdValidation, deleteMovieById);

module.exports = router;
