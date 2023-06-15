const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const User = require('../models/User');
const UserService = require('../services/UserService');
const jwt = require('jsonwebtoken');

const ONE_YEAR_IN_MS = 1000 * 60 * 60 * 24 * 7;

module.exports = Router()
  //* signs in an existing user
  .post('/sessions', async (req, res, next) => {
    try {
      const token = await UserService.signIn(req.body);
      res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.SECURE_COOKIES === 'true',
          sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
          maxAge: ONE_YEAR_IN_MS,
        })
        .json({ message: 'Signed in successfully!' });
    } catch (error) {
      next(error);
    }
  })

  //* creates a new user
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);

      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 year',
      });
      res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.SECURE_COOKIES === 'true',
          sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
          maxAge: ONE_YEAR_IN_MS,
        })
        .json({ message: 'Signed up successfully!' });
    } catch (error) {
      next(error);
    }
  })

  //* allows a user to update their profile
  .patch('/update', authenticate, async (req, res, next) => {
    try {
      const update = await User.updateUserInfo(req.user.id, req.body);
      res.json(update);
    } catch (error) {
      next(error);
    }
  })

  //* returns the current user
  .get('/', authenticate, async (req, res, next) => {
    try {
      const user = await User.getById(req.user.id);
      if (!user) {
        next();
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  })

  //* signs out current user
  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.SECURE_COOKIES === 'true',
        sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
        maxAge: ONE_YEAR_IN_MS,
      })
      .status(204)
      .send();
  })

  //* deletes current user
  .delete('/', authenticate, async (req, res, next) => {
    try {
      const user = await User.deleteUser(req.user.id);
      if (!user) {
        res.json({});
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  });
