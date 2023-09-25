const movieRoutes = require('express').Router();
const {
  validationCreateMovie,
  validationDeleteMovie,
} = require('../validation/validation');

const {
  getMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');

movieRoutes.get('/', getMovies);
movieRoutes.post('/', validationCreateMovie, createMovie);
movieRoutes.delete('/:_id', validationDeleteMovie, deleteMovie);

module.exports = movieRoutes;
