const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id).then((movie) => {
    if (!movie) {
      next(new NotFoundError('Фильм с таким _id не найдена'));
    }
    if (movie.owner._id.toString() !== req.user._id) {
      next(new ForbiddenError('Нельзя удалять фильмы других пользователей'));
    }
    Movie.findByIdAndRemove(req.params.id)
      // eslint-disable-next-line no-shadow
      .then((movie) => {
        res.send(movie);
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          next(new BadRequestError('Неправильный id'));
        } else {
          next(err);
        }
      });
  });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
