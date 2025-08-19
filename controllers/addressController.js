const db = require('../database/db');

const getAllAddresses = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM address ORDER BY street DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving addresses:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAddressById = async (req, res) => {
  try {
    const { address_id } = req.params;
    const result = await db.query('SELECT * FROM address WHERE address_id = $1', [address_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Center not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving address:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createAddress = async (req, res) => {
  try {
    const { street, city, state, zip, country} = req.body;    
    const sql = `
    INSERT INTO address (street, city, state, zip, country)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [street, city, state, zip, country];
    const result = await db.query(sql, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { address_id } = req.params;
    const result = await db.query('DELETE FROM address WHERE address_id = $1 RETURNING *', [address_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting Address:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  getAllAddresses,
  getAddressById,
  createAddress,
  deleteAddress
};