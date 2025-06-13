const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool(config.database);

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Successfully connected to PostgreSQL database');
    release();
  }
});

// Get all directory data
async function getDirectoryData() {
  try {
    const [agents, affiliated, yacht, teams, offices, fax] = await Promise.all([
      pool.query('SELECT * FROM microservices.directory_agents ORDER BY full_name'),
      pool.query('SELECT * FROM microservices.directory_affiliated_businesses ORDER BY full_name'),
      pool.query('SELECT * FROM microservices.directory_yacht_brokerage ORDER BY full_name'),
      pool.query('SELECT * FROM microservices.directory_teams ORDER BY team_name'),
      pool.query('SELECT * FROM microservices.directory_offices ORDER BY office_name'),
      pool.query('SELECT * FROM microservices.directory_fax_to_emails ORDER BY destination')
    ]);

    return {
      agents: agents.rows,
      affiliatedBusinesses: affiliated.rows,
      yachtBrokerage: yacht.rows,
      teams: teams.rows,
      offices: offices.rows,
      faxToEmails: fax.rows
    };
  } catch (error) {
    console.error('Error fetching directory data:', error);
    throw error;
  }
}

// Get a single item by type and id
async function getItem(type, id) {
  const tableMap = {
    agents: 'microservices.directory_agents',
    affiliated: 'microservices.directory_affiliated_businesses',
    yacht: 'microservices.directory_yacht_brokerage',
    teams: 'microservices.directory_teams',
    offices: 'microservices.directory_offices',
    fax: 'microservices.directory_fax_to_emails'
  };

  try {
    const table = tableMap[type];
    if (!table) {
      throw new Error('Invalid type');
    }

    const result = await pool.query(
      `SELECT * FROM ${table} WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching ${type} item:`, error);
    throw error;
  }
}

// Create a new item
async function createItem(type, data) {
  const tableMap = {
    agents: 'microservices.directory_agents',
    affiliated: 'microservices.directory_affiliated_businesses',
    yacht: 'microservices.directory_yacht_brokerage',
    teams: 'microservices.directory_teams',
    offices: 'microservices.directory_offices',
    fax: 'microservices.directory_fax_to_emails'
  };

  try {
    const table = tableMap[type];
    if (!table) {
      throw new Error('Invalid type');
    }

    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`);

    const result = await pool.query(
      `INSERT INTO ${table} (${columns.join(', ')}) 
       VALUES (${placeholders.join(', ')})
       RETURNING *`,
      values
    );

    return result.rows[0];
  } catch (error) {
    console.error(`Error creating ${type} item:`, error);
    throw error;
  }
}

// Update an existing item
async function updateItem(type, id, data) {
  const tableMap = {
    agents: 'microservices.directory_agents',
    affiliated: 'microservices.directory_affiliated_businesses',
    yacht: 'microservices.directory_yacht_brokerage',
    teams: 'microservices.directory_teams',
    offices: 'microservices.directory_offices',
    fax: 'microservices.directory_fax_to_emails'
  };

  try {
    const table = tableMap[type];
    if (!table) {
      throw new Error('Invalid type');
    }

    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');

    const result = await pool.query(
      `UPDATE ${table} 
       SET ${setClause}
       WHERE id = $${values.length + 1}
       RETURNING *`,
      [...values, id]
    );

    return result.rows[0];
  } catch (error) {
    console.error(`Error updating ${type} item:`, error);
    throw error;
  }
}

// Delete an item
async function deleteItem(type, id) {
  const tableMap = {
    agents: 'microservices.directory_agents',
    affiliated: 'microservices.directory_affiliated_businesses',
    yacht: 'microservices.directory_yacht_brokerage',
    teams: 'microservices.directory_teams',
    offices: 'microservices.directory_offices',
    fax: 'microservices.directory_fax_to_emails'
  };

  try {
    const table = tableMap[type];
    if (!table) {
      throw new Error('Invalid type');
    }

    const result = await pool.query(
      `DELETE FROM ${table} WHERE id = $1 RETURNING id`,
      [id]
    );

    return result.rows.length > 0;
  } catch (error) {
    console.error(`Error deleting ${type} item:`, error);
    throw error;
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  getDirectoryData,
  getItem,
  createItem,
  updateItem,
  deleteItem
}; 