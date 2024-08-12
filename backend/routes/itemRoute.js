import express from 'express';
import { hwItem } from '../models/HWitemModel.js';

const itemRouter = express.Router();

// ADDING NEW RECORD
itemRouter.post('/', async (req, res) => {
    try {

        const newItem = {
            name: req.body.name,
            category: req.body.category,
            quantity: req.body.quantity
        };

        const item = await hwItem.create(newItem);

        return res.send(item);

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

// GETTING ALL RECORDS
itemRouter.get('/', async (req, res) => {
    try {

        const items = await hwItem.find({});
        return res.json(items);

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

export default itemRouter;