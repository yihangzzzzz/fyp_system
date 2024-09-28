const cors = require('cors');
// const helmet = require('helmet');
const express = require('express');
const sql = require('mssql');
const session = require('express-session');
// require('dotenv').config(); // Uncomment if using dotenv for environment variables
// const PORT = require('./config.js');
const inventoryRouter = require('./routes/inventoryRoute.js');
const transferRouter = require('./routes/transferRoute.js');
const orderRouter = require('./routes/orderRoute.js');
const loginRouter = require('./routes/loginRoute.js');
const path = require('path');
const PORT = 3000;

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

// const isAuthenticated = (req, res, next) => {
//   if (req.session.loggedIn) {
//       return next();
//   } else {
//       res.redirect('/login'); // Redirect to login page if not authenticated
//   }
// };
// app.get('/protected-page', isAuthenticated, (req, res) => {
//     res.send('This is a protected page');
//     // res.redirect('/');
// });

app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use('/login', loginRouter);
app.use('/inventory', inventoryRouter);
app.use('/transfers', transferRouter);
app.use('/orders', orderRouter);
app.use('/images', express.static('images'))


app.listen(process.env.PORT || PORT, () => {
    console.log("app is running le");
})
app.post('/login/:lab', async (req, res) => {
    console.log(req.params.lab )
    let pool;
    const sqlConfig = {
      
        // user: req.body.user, //testuser
        // password: req.body.password, //1234
        user: 'testuser', //testuser
        password: '1234', //1234
        server: 'DESKTOP-VN9PRPU\\SQLEXPRESS', // or 'localhost' for a local instance
        // server: 'YIHANG\\SQLEXPRESS',
        // server: 'MDPADMIN\\SQLEXPRESS',
        // database: req.params.lab === 'sw' ? 'inventory' : "hardware_inventory",
        database: req.params.lab === 'sw' ? 'software_inventory' : "hardware_inventory",
        driver: 'msnodesqlv8',
        options: {
            trustedConnection: false,
            encrypt: false
        }
    };

    try {
      // Attempt to connect with the provided credentials
        // pool = new sql.ConnectionPool(sqlConfig);
        // await pool.connect();
        await sql.connect(sqlConfig);
        req.session.loggedIn = true; 
        console.log("connected le");
      // If connection is successfulW
      res.json({ success: true });
    } catch (err) {
      // If the connection fails, send an error response
      console.error('Login failed:', err.message);
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    } finally {
      // Ensure connection pool is closed after use
      if (pool && pool.connected) {
          // pool.close();
      }
  }
  });





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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});




