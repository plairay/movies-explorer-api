const Router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  addMovie,
  deleteMovie,
} = require('../controllers/movies');
const urlValidationMethod = require('../utils/url_valid_meth');

Router.get('/', getMovies);
Router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlValidationMethod),
    trailer: Joi.string().required().custom(urlValidationMethod),
    thumbnail: Joi.string().required().custom(urlValidationMethod),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), addMovie);
Router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }).unknown(true),
}), deleteMovie);

module.exports = Router;
