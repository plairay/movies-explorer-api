const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user');
const ValidationError = require('../errors/400-error');
const DuplicateError = require('../errors/409-error');
const NotFoundError = require('../errors/404-error');

dotenv.config();

const { NODE_ENV, JWT_SECRET } = process.env;

const getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователя с таким id не существует'))
    .then((user) => res.status(200)
      .send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Id неверный');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const {
    email,
    name,
  } = req.body;
  if (!email || !name) {
    throw new ValidationError('Введенные данные некорректны');
  }
  User.findByIdAndUpdate(req.user._id, {
    name,
    email,
  }, {
    new: true,
    runValidators: true,
  })
    .orFail(new NotFoundError('Пользователя с таким id не существует'))
    .then((data) => res.status(200)
      .send(data))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new DuplicateError('Пользователь с таким email уже существует');
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ValidationError('Введенные данные некорректны');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  if (!email || !name || !password) {
    throw new ValidationError('Неправильная почта или пароль');
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        name,
        password: hash,
      })
        .then((user) => res.status(200)
          .send({
            _id: user._id,
            name: user.name,
            email: user.email,
          }))
        .catch((err) => {
          if (err.name === 'MongoError' && err.code === 11000) {
            throw new DuplicateError('Пользователь с таким email уже существует');
          } else if (err.name === 'ValidationError' || err.name === 'CastError') {
            throw new ValidationError('Пароль или почта некорректны');
          } else {
            next(err);
          }
        })
        .catch(next);
    });
};

const login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => next(err));
};

module.exports = {
  getMyUser,
  updateProfile,
  createUser,
  login,
};
