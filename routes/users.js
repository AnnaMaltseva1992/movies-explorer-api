const userRoutes = require('express').Router();

const {
  validationUpdateProfile,
} = require('../validation/validation');

const {
  getUser,
  updateUser,
} = require('../controllers/users');

userRoutes.get('/me', getUser);

userRoutes.patch('/me', validationUpdateProfile, updateUser);

module.exports = userRoutes;
