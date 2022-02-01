DROP TABLE IF EXISTS movies;

CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date INTEGER,
    poster_path VARCHAR(10000),
    overview VARCHAR(10000),
);