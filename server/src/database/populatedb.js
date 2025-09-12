require('dotenv').config();

const { Client } = require('pg');

const SQL = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    fullname VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255) NOT NULL,
    post_text TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    is_posted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS post_comments (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    comment_text TEXT NOT NULL,
    post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert a user first
INSERT INTO users (fullname, username, password) 
VALUES ('John Doe', 'johndoe', 'password');

-- Insert blog post (user_id = 1 because John Doe is first user)
INSERT INTO blog_posts (title, post_text, user_id, created_at, updated_at, is_posted)
VALUES 
('First Blog Post', 'Hello everyone, this is my very first blog post... Signing off now!', 1, '2025-09-08 18:00:00', '2025-09-08 18:00:00', true);

-- Insert a comment
INSERT INTO post_comments (comment_text, post_id, user_id, created_at)
VALUES
('Hey this is my first comment', 1, 1, '2025-09-08 18:05:00');

`


async function main() {
    console.log('seeding...');
    const client = new Client({
        connectionString: process.env.DEV_DATABASE_CONNECTION_STRING
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log('done');
}

main();