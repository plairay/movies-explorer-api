const Router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  signUp,
  signIn,
  signOut,
} = require('../controllers/users');
const UserRouter = require('./users');
const MovieRouter = require('./movies');
const authMiddleware = require('../middlewares/auth');
const NotFoundErr = require('../errors/not-found-err');
const { MES_NOT_FOUND_PAGE } = require('../utils/constants');

Router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), signUp);
Router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), signIn);
Router.post('/signout', authMiddleware, signOut);
Router.use('/users/', authMiddleware, UserRouter);
Router.use('/movies/', authMiddleware, MovieRouter);

Router.use(authMiddleware, (req, res, next) => {
  next(new NotFoundErr(MES_NOT_FOUND_PAGE));
});

module.exports = Router;
