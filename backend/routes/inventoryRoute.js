import express from 'express';
import { hwItem } from '../models/HWitemModel.js';

const inventoryRouter = express.Router();

// ADDING NEW RECORD
inventoryRouter.post('/', async (req, res) => {
    try {

        const newItem = {
            name: req.body.name,
            serial: req.body.serial,
            category: req.body.category,
            labs: [
                {
                    name: req.body.labs
                }
            ] 
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


// UPDATE ONE QTY RECORD
itemRouter.put('/qty', async (req, res) => {
    try {
        const updateQuery = {
            serial: req.body.serial
        };

        const updateItem = {
            $inc: {quantity: (req.body.quantity)}
        };

        const item = await hwItem.findOneAndUpdate(updateQuery, updateItem, {new: true});

        return res.send(item);

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

// UPDATE ONE ORDERED RECORD
itemRouter.put('/ordered', async (req, res) => {
    try {
        const updateQuery = {
            serial: req.body.serial
        };

        const updateItem = {
            $inc: {ordered: (req.body.quantity)}
        };

        const item = await hwItem.findOneAndUpdate(updateQuery, updateItem, {new: true});

        return res.send(item);

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

export default itemRouter;