import cors from 'cors';
import express from "express";
import sql from "mssql";
import nodemailer from "nodemailer";
// import 'dotenv/config';
import { PORT } from './config.js';
import inventoryRouter from './routes/inventoryRoute.js';
import transferRouter from './routes/transferRoute.js';
import itemRouter from "./routes/itemRoute.js";
import orderRouter from './routes/orderRoute.js';
import poRouter from "./routes/poRoute.js";

const sqlConfig = {
    user: "testuser",
    password: '1234',
    // server: 'DESKTOP-VN9PRPU\\SQLEXPRESS', // or 'localhost' for a local instance
    server: 'YIHANG\\SQLEXPRESS',
    database: 'inventory',
    driver: 'msnodesqlv8',
    options: {
        // encrypt: false,
        // trustServerCertificate: true,
        trustedConnection: false,
        encrypt: false
    }
};


// Create a transporter object
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use SSL
    auth: {
      user: 'fyp.inventory.system@gmail.com',
      pass: 'mjqvcfewvocuaztd',
    }
  });
  


const app = express();

app.use(cors());
app.use(express.json());

app.use('/hardware', itemRouter);
app.use('/po', poRouter);
app.use('/order', orderRouter);


let pool;

async function connectDB() {
    try {
        pool = await new sql.connect(sqlConfig);
        app.listen(PORT, () => {
            console.log("app is running le");
        })
        console.log("connected le");
    } catch (err) {
        console.error('error is ', err);
    }
}

app.use((req, res, next) => {
    req.pool = pool;
    next();
})

app.use((req, res, next) => {
    req.transporter = transporter;
    next();
});

app.use('/inventory', inventoryRouter);
app.use('/transfers', transferRouter);
app.use('/orders', orderRouter);
connectDB();



// sql
// .connect(sqlConfig)
// .then(pool => {
//     if (pool.connecting) {
//         console.log("wait ah still connecting");
//     }
//     if (pool.connected) {
//         console.log("yas connected le high 5");
//     }
//     app.listen(PORT, () => {
//         console.log("db is up and running yay")
//     })
// .catch((error) => {
//     console.log("error la sia");
//     console.log("error is " + error);
//     });
// });

// mongoose
//     .connect(mongodbURL)
//     .then(() => {
//         console.log("yas connection success");
//         app.listen(PORT, () => {
//             console.log("app is running yay");
//         });
//     })
//     .catch((error) => {
//         console.log("error la sia");
//         console.log("error is " + error);
//     });