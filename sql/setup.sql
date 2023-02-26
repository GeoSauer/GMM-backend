-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users, spells, lists CASCADE;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- //TODO change these back to unique for rls
    -- username TEXT UNIQUE,
    username TEXT,
    -- email TEXT UNIQUE,
    email TEXT,
    password_hash TEXT NOT NULL,
    char_name TEXT,
    char_class TEXT,
    caster_lvl INT DEFAULT 0
    -- //TODO figure out how to host avatars
    -- avatar_url TEXT,
);

-- CREATE TABLE spells (
--         id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--         index TEXT,
--         -- name TEXT,
--         -- url TEXT
-- );

-- CREATE TABLE prepared (
--         id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--         user_id BIGINT,
--         FOREIGN KEY (user_id) REFERENCES users(id),
--         spell_id BIGINT,
--         FOREIGN KEY (spell_id) REFERENCES spells(id),
--         preps INT,
--         used INT
-- );