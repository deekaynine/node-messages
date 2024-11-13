const pool = require("./pool");

async function getAllUsernames() {
  const { rows } = await pool.query("SELECT * FROM usernames");
  return rows;
}

async function insertUsername(username) {
  await pool.query("INSERT INTO usernames (username) VALUES ($1)", [username]);
}

async function getUsersBySearch(searchQuery) {
    const { rows } = await pool.query("SELECT * FROM usernames WHERE username = ($1)", [searchQuery]);
    return rows;
}

module.exports = {
  getAllUsernames,
  insertUsername,
  getUsersBySearch
};