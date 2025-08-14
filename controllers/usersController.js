const db = require('../database/db');

const getAllUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}   

const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const sql = `
      UPDATE users
      SET name = $1, email = $2, role = $3, updated_at = CURRENT_TIMESTAMP
      WHERE username = $4 RETURNING *;
    `;
    const values = [name, email, role, id];
    const result = await db.query(sql, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

const deleteUser = async (req, res) => {
  try {
    const { username } = req.params;
    const result = await db.query('DELETE FROM users WHERE username = $1 RETURNING *', [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
    getAllUsers,  
    getUserByUsername,
    updateUser,
    deleteUser
};