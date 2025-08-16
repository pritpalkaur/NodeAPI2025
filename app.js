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
app.use(express.json());

app.post('/person', async (req, res) => {
  const { firstName, lastName, address } = req.body; // Adjust fields based on your Person table
  
  try {
    await sql.connect(config);
    const result = await sql.query`
      INSERT INTO Person (firstName, lastName, address)
      VALUES (${firstName}, ${lastName}, ${address})
    `;
    res.send('Person record created successfully!');
  } catch (err) {
    console.error('Error creating record:', err);
    res.status(500).send(`Error creating record: ${err.message}`);
  }
});

app.put('/person/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, address } = req.body;

  try {
    await sql.connect(config);
    const result = await sql.query`
      UPDATE Person
      SET firstName = ${firstName},
          lastName = ${lastName},
          address = ${address}
      WHERE id = ${id}
    `;
    if (result.rowsAffected[0] > 0) {
      res.send('Person record updated successfully!');
    } else {
      res.status(404).send('Person not found.');
    }
  } catch (err) {
    console.error('Error updating record:', err);
    res.status(500).send(`Error updating record: ${err.message}`);
  }
});

// // Your GET route
app.delete('/person/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await sql.connect(config);
    const result = await sql.query`
      DELETE FROM Person WHERE id = ${id}
    `;
    if (result.rowsAffected[0] > 0) {
      res.send('Person record deleted successfully!');
    } else {
      res.status(404).send('Person not found.');
    }
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).send(`Error deleting record: ${err.message}`);
  }
});
