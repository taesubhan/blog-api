const pool = require('../pool');

async function createNewUser(fullName, username, hashedPassword) {
    const {rows} = await pool.query(`
        INSERT INTO users (fullname, username, password)
        VALUES ($1, $2, $3)
        RETURNING id;
    `, [fullName, username, hashedPassword]);
    
    return rows[0] || null;
}

async function getUser(username) {
    const {rows} = await pool.query(`
        SELECT *
        FROM users
        WHERE username = $1
    `, [username])

    return rows[0] || null;
}

module.exports = {
    createNewUser,
    getUser
}