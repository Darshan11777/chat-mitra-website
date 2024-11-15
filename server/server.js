import express from 'express';
import chat_mitra from './routes/home.router.js';
import dotenv from 'dotenv';
import errorMiddleware from './middlewares/error.middleware.js';
import cors from 'cors';
import connection from './database/db.js';
import  feedback_router from './routes/feedback.router.js';
import db from './database/db.js';
import data from './aa (5).json' assert { type: 'json' }; // Add the assertion
// Load environment variables from .env file
dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Middleware example
app.use(express.json());


const newdata=(dt)=>{
  let table={}

  console.log(dt);
  dt=JSON.parse(dt)
  
  dt.forEach(arr => {
    table.arr['table']=arr.data
  });
  return table
}

// console.log('sdf',newdata(data))
console.log(process.env.DATABASE_URL);

// Routes example
app.get('/', (req, res) => {
  // res.send('Hello, world!');
  const tableName = req.query.tableName || 'default_table'; // You can pass a table name as a query parameter
  const columnDefinitions = req.query.columns || 'id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), age INT'; // Default column definitions

  const createTableSQL=  `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions})`

  db.query(`ALTER TABLE chat_mitra_feedback
MODIFY COLUMN id INT AUTO_INCREMENT;
`, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create table', details: err });
    }
    res.status(200).json({ message: `Table '${tableName}' created successfully`, result });
  });

});

app.get("/aa", (req, res) => {
  const sql = `SHOW TABLES;`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);

    const tables = result.map((row) => row.Tables_in_railway);
    console.log(tables);

    const queries = tables.map((tb) => {
      return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM \`${tb}\``, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve({ table: tb, data: result });
          }
        });
      });
    });

    // Wait for all queries to finish
    Promise.all(queries)
      .then((data) => {
        console.log(data); // Log the results from all tables
        res.json(data); // Send the results as JSON
      })
      .catch((err) => {
        res.status(500).send(err); // Handle errors
      });
  });
})

// Use the router for routes starting with "/example"
app.use('/chat-mitra', chat_mitra);


// Example route to test the database connection
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

app.use(errorMiddleware);
// connection().then(() => {
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// });