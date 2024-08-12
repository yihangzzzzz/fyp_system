import express from "express";
import { mongodbURL, PORT } from "./config.js";
import mongoose from "mongoose";
import itemRouter from "./routes/itemRoute.js";
import poRouter from "./routes/poRoute.js";
import cors from'cors';

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    console.log(req);
    return res.send('<h1>my first app yas</h1>');
})

app.use('/hardware', itemRouter);
app.use('/PO', poRouter);

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
    });