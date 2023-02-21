-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS gmm_users CASCADE;

CREATE TABLE gmm_users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    char_name TEXT,
    char_class TEXT,
    caster_lvl INT
    -- TODO figure out how to host avatars
    -- avatar_url TEXT,
);