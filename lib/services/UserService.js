const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ username, email, password, demo, expirationDate }) {
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    try {
      const users = await User.getAll();

      if (users.length && users.some((user) => user.email === email))
        throw new Error('Email already in use');

      if (users.length && users.some((user) => user.username === username))
        throw new Error('Username already in use');

      const user = await User.insert({
        username,
        email,
        passwordHash,
        demo,
        expirationDate,
      });

      return user;
    } catch (error) {
      error.status = 400;
      throw error;
    }
  }

  static async signIn({ username, email, password = '' }) {
    const userLogin = { username, email };

    try {
      const user = await User.getByLogin(userLogin);

      if (!user) throw new Error('Invalid email or username');

      if ((!!email && !!username) || (!email && !username)) {
        throw new Error('Please provide either an email or username');
      }

      if (!password) {
        throw new Error('Password is required');
      }

      if (!bcrypt.compareSync(password, user.passwordHash))
        throw new Error('Invalid password');

      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 year',
      });
      return token;
    } catch (error) {
      error.status = 401;
      throw error;
    }
  }
};
