const Movie = require('../models/movie');
const BadReqErr = require('../errors/bad-req-err');
const ForbiddenErr = require('../errors/forbidden-err');
const NotFoundErr = require('../errors/not-found-err');
const {
  MES_NOT_FOUND_FILM, MES_INVALID_DATA, MES_INVALID_FILM_ID, MES_FILM_AUTH_ERR,
} = require('../utils/constants');

const getMovies = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const movies = await Movie.find({ owner });

    return res.send(movies);
  } catch (err) { return next(err); }
};

const addMovie = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;
    const movie = new Movie({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      owner,
      movieId,
      nameRU,
      nameEN,
    });

    await movie.save();
    return res.send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') { return next(new BadReqErr(MES_INVALID_DATA)); }

    return next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const _id = req.params.movieId;
    const movie = await Movie.findById(_id);
    if (!movie) { return next(new NotFoundErr(MES_NOT_FOUND_FILM)); }
    if (String(movie.owner) !== owner) { return next(new ForbiddenErr(MES_FILM_AUTH_ERR)); }

    const movieDelete = await Movie.findByIdAndDelete(_id);
    return res.send(movieDelete);
  } catch (err) {
    if (err.name === 'CastError') { return next(new BadReqErr(MES_INVALID_FILM_ID)); }

    return next(err);
  }
};

module.exports = {
  getMovies,
  addMovie,
  deleteMovie,
};
