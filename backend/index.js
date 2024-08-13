import cors from 'cors';
import express from "express";
import mongoose from "mongoose";
import { mongodbURL, PORT } from "./config.js";
import inventoryRouter from './routes/inventoryRoute.js';
import itemRouter from "./routes/itemRoute.js";
import orderRouter from './routes/orderRoute.js';
import poRouter from "./routes/poRoute.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    console.log(req);
    return res.send('<h1>my first app yas</h1>');
})

app.use('/hardware', itemRouter);
app.use('/po', poRouter);
app.use('/order', orderRouter);
app.use('/inventory', inventoryRouter);
mongoose
    .connect(mongodbURL)
    .then(() => {
        console.log("yas connection success");
        app.listen(PORT, () => {
            console.log("app is running yay");
        });
    })
    .catch((error) => {
        console.log("error la sia");
        console.log("error is " + error);
    });