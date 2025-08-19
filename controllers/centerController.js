const db = require('../database/db');

const getAllCenters = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM center ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getCenterById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM center WHERE center_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Center not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createCenter = async (req, res) => {
  try {
    const { name, type, address_id, contact_email, contact_phone} = req.body;    
    const sql = `
    INSERT INTO center (name, type, address_id, contact_email, contact_phone)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [name, type, address_id, contact_email, contact_phone];
    const result = await db.query(sql, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating center:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateCenter = async (req, res) => {
  try {
    console.log('updating center:', req.body);
    const { center_id } = req.params;
    const { name, type, address_id, contact_email, contact_phone } = req.body;
    const sql = `
      UPDATE center
      SET name = $1, type = $2, address_id = $3, contact_email = $4, contact_phone = $5, updated_at = CURRENT_TIMESTAMP
      WHERE center_id = $6 RETURNING *;
    `;
    const values = [  name, type, address_id, contact_email, contact_phone, center_id];
    const result = await db.query(sql, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Center not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating center:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteCenter = async (req, res) => {
  try {
    const { center_id } = req.params;
    const result = await db.query('DELETE FROM center WHERE center_id = $1 RETURNING *', [center_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Center not found' });
    }
    res.json({ message: 'Center deleted successfully' });
  } catch (error) {
    console.error('Error deleting center:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  getAllCenters,
  getCenterById,
  createCenter,
  updateCenter,
  deleteCenter
};