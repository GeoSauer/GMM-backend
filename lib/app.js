const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const authenticate = require('./middleware/authenticate');

require('./tasks/demoUserCleanup');

// Built in middleware
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      //? laptop
      'http://192.168.0.100:3000',
      //? phone
      'http://192.168.0.104:3000',
      'https://grimoire-for-the-modern-mage.netlify.app',
    ],
    credentials: true,
  })
);

// App routes
app.use('/api/v1/users', require('./controllers/users'));
app.use(
  '/api/v1/characters',
  authenticate,

  require('./controllers/characters')
);
app.use('/api/v1/spells', authenticate, require('./controllers/spells'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
