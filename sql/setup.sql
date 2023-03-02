-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users, spells, users_spells CASCADE;

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
    char_lvl INT,
    char_mod INT,
    caster_lvl INT
    -- //TODO figure out how to host avatars
    -- avatar_url TEXT,
);

CREATE TABLE spells (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        index TEXT,
        name TEXT,
        level INT,
        school TEXT,
        classes TEXT[] DEFAULT ARRAY[]::TEXT[]
);

CREATE TABLE users_spells (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id BIGINT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        spell_id BIGINT,
        FOREIGN KEY (spell_id) REFERENCES spells(id),
        known BOOLEAN,
        prepared BOOLEAN
);

-- ! DUMMY DATA FOR TESTING --

-- INSERT INTO users (char_class, caster_lvl)
-- VALUES 
-- ('Wizard', 5),
-- ('Bard', 8),
-- ('Druid', 2),
-- ('Cleric', 5),
-- ('Paladin', 3);

INSERT INTO spells (index, name, level, school, classes)
VALUES 
('alter-self', 'alter self', 2, 'transmutation', '{"Sorcerer", "Wizard"}'),
('animal-shapes', 'animal shapes', 8, 'transmutation', '{"Druid"}'),
('alarm', 'alarm', 1, 'abjuration', '{"Ranger", "Wizard"}'),
('arcane-eye', 'arcane-eye', 4, 'divination', '{"cleric", "Wizard"}'),
('arcane-sword', 'arcane sword', 7, 'evocation', '{"Bard","Wizard"}');


-- INSERT INTO users_spells (user_id, spell_id, known, prepared)
-- VALUES ();