// models/personModel.js
const config = {
  user: 'your_username',
  password: 'your_password',
  server: 'your_server',
  database: 'your_database',
  options: {
    encrypt: true, // for Azure
    trustServerCertificate: true // for local dev / self-signed certs
  }
};

const sql = require('mssql');

const createPerson = async (personData) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
      INSERT INTO Person (firstName, lastName, address)
      VALUES (${personData.firstName}, ${personData.lastName}, ${personData.address});
      SELECT SCOPE_IDENTITY() AS id;`;
    return result.recordset[0]; // return new id
  } catch (err) {
    throw err;
  }
};

module.exports = { createPerson };
