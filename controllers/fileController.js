// controllers/fileController.js
const db = require('../database/db');
const path = require('path');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { file_type, description } = req.body;
    const username = req.user.username;
    const url = `/public/${req.file.filename}`; // Path to the uploaded file

    const sql = `
      INSERT INTO "file" (file_type, url, username, description)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [file_type, url, username, description];
    const result = await db.query(sql, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { uploadFile };