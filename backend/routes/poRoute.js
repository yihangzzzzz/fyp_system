import express from 'express';
import { PO } from '../models/poModel.js';

const poRouter = express.Router();

// ADDING NEW RECORD
poRouter.post('/', async (req, res) => {
    try {

        const newPO = {
            number: req.body.number,
            name: req.body.name,
            quantity: req.body.quantity,
            date: req.body.date
        };

        const po = await PO.create(newPO);

        return res.send(po);

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

// GETTING ALL RECORDS
poRouter.get('/', async (req, res) => {
    try {

        const pos = await PO.find({});
        return res.json(pos);

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

export default poRouter;