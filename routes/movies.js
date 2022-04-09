const router = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  validationMovie,
  validationMovieDelete,
} = require('../middlewares/Validation');

router.get('/movies', getMovies);
router.post('/movies', validationMovie, createMovie);
router.delete('/movies/:id', validationMovieDelete, deleteMovie);

module.exports = router;
