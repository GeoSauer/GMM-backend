-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users, spells, spellbooks, spellslots CASCADE;

CREATE TABLE users (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- //TODO change these back to unique for rls
    -- username TEXT UNIQUE,
        username TEXT,
    -- email TEXT UNIQUE,
        email TEXT,
    -- password_hash TEXT NOT NULL,
        password_hash TEXT,
        char_name TEXT,
        char_class TEXT,
        char_lvl INT,
        char_mod INT,
        caster_lvl INT,
        prof_bonus INT,
    -- //TODO figure out how to host avatars
    -- avatar_url TEXT,
        cantrips_known INT DEFAULT 0,
        spells_known INT DEFAULT 0,
        level_1_spell_slots INT DEFAULT 0,
        level_2_spell_slots INT DEFAULT 0,
        level_3_spell_slots INT DEFAULT 0,
        level_4_spell_slots INT DEFAULT 0,
        level_5_spell_slots INT DEFAULT 0,
        level_6_spell_slots INT DEFAULT 0,
        level_7_spell_slots INT DEFAULT 0,
        level_8_spell_slots INT DEFAULT 0,
        level_9_spell_slots INT DEFAULT 0
);

CREATE TABLE spells (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        index TEXT,
        level INT,
        school TEXT,
        classes TEXT[] DEFAULT ARRAY[]::TEXT[]
);

CREATE TABLE spellbooks (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id BIGINT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        spell_id BIGINT,
        FOREIGN KEY (spell_id) REFERENCES spells(id),
        prepared BOOLEAN DEFAULT false
        --TODO add 'known' back in as a way to validate the spellbooks/:id route?
);

-- CREATE TABLE spellslots (
--         id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--         user_id BIGINT,
--         FOREIGN KEY (user_id) REFERENCES users(id),
--         cantrips INT DEFAULT 0,
--         level_1 INT DEFAULT 0,
--         level_2 INT DEFAULT 0,
--         level_3 INT DEFAULT 0,
--         level_4 INT DEFAULT 0,
--         level_5 INT DEFAULT 0,
--         level_6 INT DEFAULT 0,
--         level_7 INT DEFAULT 0,
--         level_8 INT DEFAULT 0,
--         level_9 INT DEFAULT 0
-- );

-- ! DUMMY DATA FOR TESTING --

INSERT INTO users (char_class, caster_lvl)
VALUES 
('Wizard', 5),
('Bard', 8),
('Druid', 2),
('Cleric', 5),
('Paladin', 3);

INSERT INTO spells (index, level, school, classes)
VALUES 
('alter-self', 2, 'transmutation', '{"Sorcerer", "Wizard"}'),
('animal-shapes', 8, 'transmutation', '{"Druid"}'),
('alarm', 1, 'abjuration', '{"Ranger", "Wizard"}'),
('arcane-eye', 4, 'divination', '{"Cleric", "Wizard"}'),
('arcane-sword', 7, 'evocation', '{"Bard","Wizard"}');


INSERT INTO spellbooks (user_id, spell_id, prepared)
VALUES 
(1, 1, true),
(1, 3, false),
(1, 4, true),
(1, 5, false),
(2, 5, false),
(3, 2, true),
(4, 4, true);
