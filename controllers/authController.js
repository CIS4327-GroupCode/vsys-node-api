const db = require('../database/db'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, first_name, last_name, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // SQL to insert a new user with default 'Volunteer' type (id=1)
    const sql = `
      INSERT INTO "users" (username, first_name, last_name, password_hash, email, type_id)
      VALUES ($1, $2, $3, $4, $5, 1) RETURNING *;
    `;
    const values = [username, first_name, last_name, password_hash, email];
    const result = await db.query(sql, values);

    // Don't send the password hash back to the client
    const newUser = result.rows[0];
    delete newUser.password_hash;
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const sql = `SELECT * FROM "users" WHERE username = $1;`;
    const userResult = await db.query(sql, [username]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const payload = {
      username: user.username,
      user_type: user.type_id, // Use type_id for role-based authorization
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login };