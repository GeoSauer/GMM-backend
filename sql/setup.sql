-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users, characters, spells, known_spells CASCADE;

CREATE TABLE users (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- //TODO change these back to unique for rls
    -- username TEXT UNIQUE,
        username TEXT,
    -- email TEXT UNIQUE,
        email TEXT,
    -- password_hash TEXT NOT NULL,
        password_hash TEXT
);

CREATE TABLE characters (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id BIGINT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        char_name TEXT,
        char_class TEXT,
        char_lvl INT,
        char_mod INT,
        caster_lvl INT,
        prof_bonus INT,
        save_dc INT DEFAULT 0,
        attack_bonus INT DEFAULT 0,
        cantrips_available INT DEFAULT 0,
        cantrips_known INT DEFAULT 0,
        spells_available INT DEFAULT 0,
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

CREATE TABLE known_spells (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id BIGINT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        char_id BIGINT,
        FOREIGN KEY (char_id) REFERENCES characters(id),
        spell_id BIGINT,
        FOREIGN KEY (spell_id) REFERENCES spells(id),
        prepared BOOLEAN DEFAULT false,
        known BOOLEAN DEFAULT true
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
('alter-self', 'Alter Self', 2, 'Transmutation', '{"Sorcerer", "Wizard"}'),
('animal-shapes', 'Animal Shapes', 8, 'Transmutation', '{"Druid"}'),
('alarm', 'Alarm', 1, 'Abjuration', '{"Ranger", "Wizard"}'),
('arcane-eye', 'Arcane Eye', 4, 'Divination', '{"Cleric", "Wizard"}'),
('arcane-sword', 'Arcane Sword', 7, 'Evocation', '{"Bard","Wizard"}'),
('acid-arrow', 'Acid Arrow', 2, 'Evocation', '{"Wizard"}');


-- INSERT INTO known_spells (user_id, spell_id, prepared)
-- VALUES 
-- (1, 1, true),
-- (1, 3, false),
-- (1, 4, true),
-- (1, 5, false),
-- (2, 5, false),
-- (3, 2, true),
-- (4, 4, true);
