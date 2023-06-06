# Grimoire for the Modern Mage - Backend

GMM is a spellcasting companion app for virtual or in-person Dnd 5e sessions. It allows users to easily create a profile with as many characters as they want, and effortlessly learn, forget, prepare, and un-prepare spells with those characters. Spell slots are tracked, and slot level, ritual, and concentration spell casting is all handled on a spell by spell basis.

## Table of contents

- [Scripts](#scripts)
- [User Routes](#user-routes)
- [Character Routes](#character-routes)
- [Spell Routes](#spell-routes)
- [Technologies](#technologies)
- [Sources](#sources)

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
| `/api/v1/spells/all/`               | `GET`       | None      | Returns all spells                           |
| `/api/v1/spells/:charId/available/` | `GET`       | None      | Returns all available spells for a character |
| `/api/v1/spells/:charId/known/`     | `GET`       | None      | Returns all known spells for a character     |
| `/api/v1/spells/:charId/prepared/`  | `GET`       | None      | Returns all prepared spells for a character  |

## Technologies

- Node.js v19.7.0
- Express.js v4.18.1

## Sources

- All spell data is returned from the incredible [dnd5eapi.co](https://www.dnd5eapi.co/)
