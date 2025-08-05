// controllers/opportunityController.js
const db = require('../db');

const getAllOpportunities = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM opportunity ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getOpportunityById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM opportunity WHERE opportunity_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createOpportunity = async (req, res) => {
  try {
    const { title, valid_until, published, role, description, center_id, status_id } = req.body;
    const published_by = req.user.username; // Get username from JWT
    const sql = `
      INSERT INTO opportunity (title, valid_until, published, role, description, center_id, status_id, published_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
    `;
    const values = [title, valid_until, published, role, description, center_id, status_id, published_by];
    const result = await db.query(sql, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, valid_until, published, role, description, center_id, status_id } = req.body;
    const sql = `
      UPDATE opportunity
      SET title = $1, valid_until = $2, published = $3, role = $4, description = $5, center_id = $6, status_id = $7, updated_at = CURRENT_TIMESTAMP
      WHERE opportunity_id = $8 RETURNING *;
    `;
    const values = [title, valid_until, published, role, description, center_id, status_id, id];
    const result = await db.query(sql, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM opportunity WHERE opportunity_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    res.json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};