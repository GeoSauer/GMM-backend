DROP TABLE IF EXISTS users, characters, spells, known_spells CASCADE;

CREATE TABLE users (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    		username TEXT UNIQUE,
    		email TEXT UNIQUE,
    		password_hash TEXT NOT NULL,
				demo BOOLEAN DEFAULT false,
				expiration_date TIMESTAMP
);

CREATE TABLE characters (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id BIGINT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        char_name TEXT,
        char_class TEXT,
        char_lvl INT,
        char_mod INT,
        caster_lvl INT,
        prof_bonus INT,
        save_dc INT DEFAULT 0,
        attack_bonus INT DEFAULT 0,
        -- //TODO 
        -- !removing spell amount tracking for v1
        -- cantrips_available INT DEFAULT 0,
        -- cantrips_known INT DEFAULT 0,
        -- spells_available INT DEFAULT 0,
        -- spells_known INT DEFAULT 0,
        -- !--------------------------------------
        level_1_spell_slots INT DEFAULT 0,
        level_2_spell_slots INT DEFAULT 0,
        level_3_spell_slots INT DEFAULT 0,
        level_4_spell_slots INT DEFAULT 0,
        level_5_spell_slots INT DEFAULT 0,
        level_6_spell_slots INT DEFAULT 0,
        level_7_spell_slots INT DEFAULT 0,
        level_8_spell_slots INT DEFAULT 0,
        level_9_spell_slots INT DEFAULT 0,
        -- //TODO figure out how to host avatars
        avatar TEXT
);

CREATE TABLE spells (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        index TEXT,
        name TEXT,
        level INT,
        school TEXT,
        classes TEXT[] DEFAULT ARRAY[]::TEXT[],
				known BOOLEAN DEFAULT false
);

CREATE TABLE known_spells (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id BIGINT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        char_id BIGINT,
        FOREIGN KEY (char_id) REFERENCES characters(id) ON DELETE CASCADE,
        spell_id BIGINT,
        FOREIGN KEY (spell_id) REFERENCES spells(id),
        known BOOLEAN DEFAULT true,
        prepared BOOLEAN DEFAULT false,
				from_all BOOLEAN DEFAULT false
        
);

-- ! DUMMY DATA FOR TESTING --

INSERT INTO spells (index, name, level, school, classes)
VALUES 
('spell-one', 'Spell One', 0, 'Transmutation', '{"Sorcerer", "Wizard"}'),
('spell-two', 'Spell Two', 1, 'Divination', '{"Cleric", "Druid", "Wizard"}'),
('spell-three', 'Spell Three', 2, 'Abjuration', '{"Ranger", "Wizard"}'),
('spell-four', 'Spell Four', 3, 'Conjuration', '{"Cleric", "Wizard"}'),
('alter-self', 'Spell Five', 7, 'Evocation', '{"Bard","Wizard", "Paladin"}');
