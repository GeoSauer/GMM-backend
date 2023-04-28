# GMM Backend

## Scripts

| command                | description                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `npm start`            | starts the app - should only be used in production as changes will not get reloaded |
| `npm run start:watch`  | runs the app using `nodemon` which watches for changes and reloads the app          |
| `npm test`             | runs the tests once                                                                 |
| `npm run test:watch`   | continually watches and runs the tests when files are updated                       |
| `npm run setup-db`     | sets up the database locally                                                        |
| `npm run setup-heroku` | sets up the database on heroku                                                      |

## User Routes

| Route                     | HTTP Method | HTTP Body                                                          | Description                          |
| ------------------------- | ----------- | ------------------------------------------------------------------ | ------------------------------------ |
| `/api/v1/users/`          | `POST`      | `{email: 'example@test.com', password: '12345', username: 'Test'}` | Creates new user                     |
| `/api/v1/users/sessions/` | `POST`      | `{email: 'example@test.com', password: '12345'}`                   | Signs in existing user with email    |
| `/api/v1/users/sessions/` | `POST`      | `{username: 'Test', password: '12345'}`                            | Signs in existing user with username |
| `/api/v1/users/update/`   | `PATCH`     | `{username: 'TestUpdate'}`                                         | Updates current user                 |
| `/api/v1/users/`          | `GET`       | None                                                               | Returns current user                 |
| `/api/v1/users/sessions/` | `DELETE`    | None                                                               | Deletes a user session               |

## Character Routes

| Route                                  | HTTP Method | HTTP Body                                                                 | Description                                 |
| -------------------------------------- | ----------- | ------------------------------------------------------------------------- | ------------------------------------------- |
| `/api/v1/characters/`                  | `POST`      | `{charName: 'CharTest', charClass: 'Wizard', charLvl: '8', charMod: '3'}` | Creates new character                       |
| `/api/v1/characters/update/`           | `PATCH`     | `{charId: 1, charName: 'NewCharName'}`                                    | Updates current character                   |
| `/api/v1/characters/all/`              | `GET`       | None                                                                      | Returns all characters for current user     |
| `/api/v1/characters/:charId/`          | `GET`       | None                                                                      | Returns a single character for current user |
| `/api/v1/characters/:charId/`          | `DELETE`    | None                                                                      | Deletes a character                         |
| `/api/v1/characters/:charId/:spellId/` | `DELETE`    | None                                                                      | Lets current character forget a spell       |
| `/api/v1/characters/learn/`            | `POST`      | `{charId: 1, spellId: 4}`                                                 | Lets current character learn a spell        |
| `/api/v1/characters/cast/`             | `PATCH`     | `{charId: 1, slotLevel: 2}`                                               | Lets current character cast a spell         |
| `/api/v1/characters/prepare/`          | `PATCH`     | `{charId: 1, slotLevel: 2, prepared: 'true'}`                             | Lets current character un/prepare a spell   |

## Spell Routes

| Route                               | HTTP Method | HTTP Body | Description                                  |
| ----------------------------------- | ----------- | --------- | -------------------------------------------- |
| `/api/v1/spells/:spellId/details/`  | `GET`       | None      | Returns details on a single spell            |
| `/api/v1/spells/:charId/available/` | `GET`       | None      | Returns all available spells for a character |
| `/api/v1/spells/:charId/known/`     | `GET`       | None      | Returns all known spells for a character     |
| `/api/v1/spells/:charId/prepared/`  | `GET`       | None      | Returns all prepared spells for a character  |
