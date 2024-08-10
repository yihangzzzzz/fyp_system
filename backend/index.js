import express from "express";
import { mongodbURL, PORT } from "./config.js";
import mongoose from "mongoose";
import { Part } from "./models/partModel.js";
import router from "./routes/partRoutes.js";
import cors from'cors';

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    console.log(req);
    return res.send('<h1>my first app yas</h1>');
})

app.use('/parts', router);

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