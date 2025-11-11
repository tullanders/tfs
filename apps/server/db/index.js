import pool from './pool.js';

/**
 * Execute a SQL query
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error', { text, error: error.message });
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 * @returns {Promise} Database client
 */
export async function getClient() {
  const client = await pool.connect();
  const originalQuery = client.query;
  const originalRelease = client.release;

  // Add query logging
  client.query = (...args) => {
    client.lastQuery = args;
    return originalQuery.apply(client, args);
  };

  // Track release to prevent double release
  client.release = () => {
    client.query = originalQuery;
    client.release = originalRelease;
    return originalRelease.apply(client);
  };

  return client;
}

/**
 * Find one record
 * @param {string} table - Table name
 * @param {Object} where - Where conditions
 * @returns {Promise} Single record or null
 */
export async function findOne(table, where) {
  const keys = Object.keys(where);
  const values = Object.values(where);
  const conditions = keys.map((key, idx) => `${key} = $${idx + 1}`).join(' AND ');
  
  const text = `SELECT * FROM ${table} WHERE ${conditions} LIMIT 1`;
  const result = await query(text, values);
  
  return result.rows[0] || null;
}

/**
 * Find many records
 * @param {string} table - Table name
 * @param {Object} where - Where conditions (optional)
 * @returns {Promise} Array of records
 */
export async function findMany(table, where = {}) {
  const keys = Object.keys(where);
  const values = Object.values(where);
  
  let text = `SELECT * FROM ${table}`;
  
  if (keys.length > 0) {
    const conditions = keys.map((key, idx) => `${key} = $${idx + 1}`).join(' AND ');
    text += ` WHERE ${conditions}`;
  }
  
  const result = await query(text, values);
  return result.rows;
}

/**
 * Insert a record
 * @param {string} table - Table name
 * @param {Object} data - Data to insert
 * @returns {Promise} Inserted record
 */
export async function insert(table, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const columns = keys.join(', ');
  const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(', ');
  
  const text = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
  const result = await query(text, values);
  
  return result.rows[0];
}

/**
 * Update a record
 * @param {string} table - Table name
 * @param {Object} data - Data to update
 * @param {Object} where - Where conditions
 * @returns {Promise} Updated record
 */
export async function update(table, data, where) {
  const dataKeys = Object.keys(data);
  const dataValues = Object.values(data);
  const whereKeys = Object.keys(where);
  const whereValues = Object.values(where);
  
  const setClause = dataKeys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');
  const whereClause = whereKeys.map((key, idx) => `${key} = $${dataKeys.length + idx + 1}`).join(' AND ');
  
  const text = `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING *`;
  const result = await query(text, [...dataValues, ...whereValues]);
  
  return result.rows[0];
}

/**
 * Delete a record
 * @param {string} table - Table name
 * @param {Object} where - Where conditions
 * @returns {Promise} Number of deleted rows
 */
export async function remove(table, where) {
  const keys = Object.keys(where);
  const values = Object.values(where);
  const conditions = keys.map((key, idx) => `${key} = $${idx + 1}`).join(' AND ');
  
  const text = `DELETE FROM ${table} WHERE ${conditions}`;
  const result = await query(text, values);
  
  return result.rowCount;
}

/**
 * Get complete hierarchy tree with entity information
 * @returns {Promise} Array of hierarchy nodes with entity data
 */
export async function getTree() {
  const text = `
    SELECT 
      h.id,
      h.entity_id,
      h.parent_id,
      h.level,
      h.created_at,
      e.name,
      e.entity_type,
      e.legal_type,
      e.registration_number,
      e.is_active
    FROM hierarchy h
    JOIN entities e ON h.entity_id = e.id
    --ORDER BY h.level, h.id
    ORDER BY h.id, h.parent_id
  `;
  
  const result = await query(text, []);
  return result.rows;
}

/**
 * Get hierarchy tree starting from a specific node
 * @param {number} nodeId - Root node ID to start from
 * @returns {Promise} Array of hierarchy nodes with entity data
 */
export async function getTreeFromNode(nodeId) {
  const text = `
    WITH RECURSIVE tree AS (
      SELECT 
        h.id,
        h.entity_id,
        h.parent_id,
        h.level,
        h.created_at,
        e.name,
        e.entity_type,
        e.legal_type,
        e.registration_number,
        e.is_active
      FROM hierarchy h
      JOIN entities e ON h.entity_id = e.id
      WHERE h.id = $1
      
      UNION ALL
      
      SELECT 
        h.id,
        h.entity_id,
        h.parent_id,
        h.level,
        h.created_at,
        e.name,
        e.entity_type,
        e.legal_type,
        e.registration_number,
        e.is_active
      FROM hierarchy h
      JOIN entities e ON h.entity_id = e.id
      INNER JOIN tree t ON h.parent_id = t.id
    )
    SELECT * FROM tree
    ORDER BY level, id
  `;
  
  const result = await query(text, [nodeId]);
  return result.rows;
}

/**
 * Get children of a specific node
 * @param {number} parentId - Parent node ID
 * @returns {Promise} Array of child nodes with entity data
 */
export async function getChildren(parentId) {
  const text = `
    SELECT 
      h.id,
      h.entity_id,
      h.parent_id,
      h.level,
      h.created_at,
      e.name,
      e.entity_type,
      e.legal_type,
      e.registration_number,
      e.is_active
    FROM hierarchy h
    JOIN entities e ON h.entity_id = e.id
    WHERE h.parent_id = $1
    ORDER BY h.id
  `;
  
  const result = await query(text, [parentId]);
  return result.rows;
}

export default {
  query,
  getClient,
  findOne,
  findMany,
  insert,
  update,
  remove,
  getTree,
  getTreeFromNode,
  getChildren,
};
