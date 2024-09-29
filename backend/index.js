const cors = require('cors');
// const helmet = require('helmet');
const express = require('express');
const sql = require('mssql');
const { ConnectionPool } = require('mssql')
const session = require('express-session');
// require('dotenv').config(); // Uncomment if using dotenv for environment variables
// const PORT = require('./config.js');
const inventoryRouter = require('./routes/inventoryRoute.js');
const transferRouter = require('./routes/transferRoute.js');
const orderRouter = require('./routes/orderRoute.js');
const loginRouter = require('./routes/loginRoute.js');
const path = require('path');
const PORT = 3000;
const { poolHWPromise, poolSWPromise } = require('./config.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true if using HTTPS
  }));

const sqlPool = async function (req, res, next) {
  if (req.query.db) {
    if (req.query.db === 'sw') {
      req.sqlPool = await poolSWPromise; // Use hardware inventory pool
      console.log("sw pool connected");
    } else {

      req.sqlPool = await poolHWPromise; // Default to software inventory pool
      console.log("hw pool connected");
    }
  }
  next();
}

app.use(sqlPool)
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use('/login_be', loginRouter);
app.use('/inventory_be', inventoryRouter);
app.use('/transfers_', transferRouter);
app.use('/orders_', orderRouter);
app.use('/images_', express.static('images'))


app.listen(process.env.PORT || PORT, () => {
    console.log("app is running le");
})
// app.post('/login_be', async (req, res) => {
//     let pool;
//     let sqlConfig = {
      
//         // user: req.body.user, //testuser
//         // password: req.body.password, //1234
//         user: 'testuser', //testuser
//         password: '1234', //1234
//         server: 'DESKTOP-VN9PRPU\\SQLEXPRESS', // or 'localhost' for a local instance
//         // server: 'YIHANG\\SQLEXPRESS',
//         // server: 'MDPADMIN\\SQLEXPRESS',
//         database: req.query.db === 'sw' ? 'software_inventory' : "hardware_inventory",
//         // database: req.params.lab === 'sw' ? 'software_inventory' : "hardware_inventory",
//         driver: 'msnodesqlv8',
//         options: {
//             trustedConnection: false,
//             encrypt: false
//         }
//     };

//     try {
//       // Attempt to connect with the provided credentials
//         // pool = new ConnectionPool(sqlConfig);
//         // await pool.connect();
//         await sql.connect(sqlConfig);
//         req.session.loggedIn = true; 
//         console.log("connected le");
//       // If connection is successfulW
//       res.json({ success: true });
//     } catch (err) {
//       // If the connection fails, send an error response
//       console.error('Login failed:', err.message);
//       res.status(401).json({ success: false, message: 'Invalid credentials' });
//     } finally {
//       // Ensure connection pool is closed after use
//       if (pool && pool.connected) {
//           // pool.close();
//       }
//   }
//   });
// const sqlConfigSW = {
//   user: 'testuser',
//   password: '1234',
//   server: 'DESKTOP-VN9PRPU\\SQLEXPRESS',
//   database: 'software_inventory',
//   driver: 'msnodesqlv8',
//   options: { trustedConnection: false, encrypt: false },
//   pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
// };

// const sqlConfigHW = {
//   user: 'testuser',
//   password: '1234',
//   server: 'DESKTOP-VN9PRPU\\SQLEXPRESS',
//   database: 'hardware_inventory',
//   driver: 'msnodesqlv8',
//   options: { trustedConnection: false, encrypt: false },
//   pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
// };

// // Create connection pools for each
// const poolSWPromise = new sql.ConnectionPool(sqlConfigSW).connect().then(pool => {
//   console.log('Connected to Software Inventory DB');
//   return pool;
// });

// const poolHWPromise = new sql.ConnectionPool(sqlConfigHW).connect().then(pool => {
//   console.log('Connected to Hardware Inventory DB');
//   return pool;
// });





// Protect routes by using the middleware


// const sqlConfig = {
//   user: 'testuser', //testuser
//   password: '1234', //1234
//   // server: 'DESKTOP-VN9PRPU\\SQLEXPRESS', // or 'localhost' for a local instance
//   server: 'YIHANG\\SQLEXPRESS',
//   // server: 'MDPADMIN\\SQLEXPRESS',
//   database: 'inventory',
//   driver: 'msnodesqlv8',
//   options: {
//       trustedConnection: false,
//       encrypt: false
//   }
// };
// async function connectDB() {
//     try {
//         pool = await new sql.connect(sqlConfig);
//         app.listen(process.env.PORT || PORT, () => {
//             console.log("app is running le");
//         })
//         console.log("connected le");
//     } catch (err) {
//         console.error('error is ', err);
//     }
// }
// connectDB();


// app.use(async (req, res, next) => {
//   // const { db } = req.query; // Get the database choice from query parameters
//   if (req.query.db) {
//     try {
//         if (req.query.db === 'sw') {
//           req.test = 'sw is here';
//             // req.sqlPool = await poolSWPromise; // Use hardware inventory pool
//             // res.sqlPool = 'nice sw'
//             console.log("sw pool connected", req.test);
//         } else {
//           req.test = 'hw is here';
//             // req.sqlPool = await poolHWPromise; // Default to software inventory pool
//             // res.sqlPool = 'nice hw'
//             console.log("hw pool connected", req.test);
//         }
        
//     } catch (err) {
//         console.error('Error acquiring connection pool:', err);
//         res.status(500).send('Database connection error');
//     }
//   }
//   next();
// });

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


