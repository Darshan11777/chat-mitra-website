import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
// // Create the MySQL live server connection


// const connection=mysql.createConnection( 'mysql://root:rUhPwPVWszkRWXRMjGbhfhTkJHWIQfNj@junction.proxy.rlwy.net:25954/railway')
// const connection = mysql.createConnection({
//   host:'mysql.railway.internal',
//   user:'root',
//   password: 'rUhPwPVWszkRWXRMjGbhfhTkJHWIQfNj',
//   database: 'railway',
//   port: '3306',
  
// });
// Create the MySQL connection
// // const connection : mysql.createConnection({
// //     host: 'localhost',
// //     user: 'root', // your MySQL username
// //     password: 'darshan123', // your MySQL password
// //     database: 'users', // your database name
// // });



const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    
    port: process.env.DB_PORT,
  };


  

  const db = mysql.createConnection(dbConfig);

db.connect((err)=>{
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});


// // Export the connection
export default db;

