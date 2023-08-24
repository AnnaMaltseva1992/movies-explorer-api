const Movie = require('../models/movies');

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');

const getMovies = (req, res, next) => {
  Movie
    .find({})
    .populate('owner')
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
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
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
    owner: req.user._id,
  })
    .then((movie) => res.status(201)
      .send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные фильма'));
      } return next(err);
    });
};

const deleteMovie = (req, res, next) => Movie.findById(req.params.movieId)
  .then((movie) => {
    if (!movie) {
      throw new NotFoundError('Фильм не найден');
    }
    if (!movie.owner.equals(req.user._id)) {
      return next(new ForbiddenError('Вы не можете удалять фильмы других пользователей'));
    }
    return Movie.deleteOne()
      .then(() => res.send({ message: 'Фильм удален' }))
      .catch(next);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные фильма'));
    }
    return next(err);
  });

module.exports = {
  getMovies,
  deleteMovie,
  createMovie,
};
