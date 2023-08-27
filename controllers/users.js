const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные пользователя'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => res.status(201).send({
          data: {
            name: user.name,
            email: user.email,
          },
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new BadRequestError('Переданы некорректные данные пользователя'));
          } if (err.code === 11000) {
            return next(new ConflictError('Выбранный вами email уже используется'));
          }
          return next(err);
        });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const {
    name,
    email,
  } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      {
        name,
        email,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) return next(new ConflictError('Пользователь уже существует'));
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь не найден'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные пользователя'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-key', { expiresIn: '7d' });
      // const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  login,
};
