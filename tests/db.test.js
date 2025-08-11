const { Pool } = require('pg');

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    connect: jest.fn((cb) => cb(null, { release: jest.fn() }, jest.fn())),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('db.js', () => {
  let db;
  beforeEach(() => {
    jest.resetModules();
    db = require('../database/db');
  });

  it('should call pool.query with correct arguments', async () => {
    const mockResult = { rows: [{ id: 1 }] };
    db.pool.query.mockResolvedValue(mockResult);

    const sql = 'SELECT * FROM "user" WHERE id = $1';
    const params = [1];
    const result = await db.query(sql, params);

    expect(db.pool.query).toHaveBeenCalledWith(sql, params);
    expect(result).toBe(mockResult);
  });

  it('should export pool for direct access', () => {
    expect(db.pool).toBeDefined();
    expect(typeof db.pool.query).toBe('function');
  });
});