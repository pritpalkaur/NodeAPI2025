const express = require('express');
const app = express();

const sql = require('mssql');
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
const config = {
  server: 'PRITI_LAPTOP', // or your server instance
  database: 'DevDb',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  authentication: {
    type: 'default', // Use 'default' for SQL Server Authentication
    options: {
      userName: 'user1', // your SQL login username
      password: 'password' // your SQL login password
    }
  }
};
app.get('/test-connection', async (req, res) => {
  try {
    await sql.connect(config);
    res.send('Connected to SQL Server successfully!');
  } catch (err) {
    console.error('Connection failed:', err);
    res.status(500).send(`Connection failed: ${err.message}`);
  }
});

// Person API to retrieve all person records
app.get('/person', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Person`;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error in /person:', err);
    res.status(500).send(`Error fetching data: ${err.message}`);
  }
});

// // Your GET route
// app.get('/hello', (req, res) => {
//   res.send('Hello, this is a GET request!');
// });

// // Starting the server
// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
