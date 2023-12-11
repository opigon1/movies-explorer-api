const router = require("express").Router();
const {
  createMovie,
  getMovies,
  deleteMovieById,
} = require("../controllers/movies");
const { celebrate, Joi } = require("celebrate");

router.post("/", createMovie);
router.get("/", getMovies);
router.delete(
  "/:movieId",
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24),
    }),
  }),
  deleteMovieById
);

module.exports = router;
