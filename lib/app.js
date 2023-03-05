const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
// Built in middleware
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://gmm.netlify.app',
    ],
    credentials: true,
  })
);

// App routes
app.use('/api/v1/users', require('./controllers/users'));
app.use('/api/v1/spells', require('./controllers/spells'));
app.use('/api/v1/spellbook', require('./controllers/spellbooks'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
