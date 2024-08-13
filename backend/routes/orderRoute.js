import express from 'express';
import { hwItem } from '../models/HWitemModel.js';
import { Order } from '../models/orderModel.js';

const orderRouter = express.Router();

// ADDING NEW RECORD
orderRouter.post('/', async (req, res) => {
    try {

        const newOrder = {
            number: req.body.number,
            name: req.body.name,
            serial: req.body.serial,
            quantity: req.body.quantity,
            date: req.body.date,
            status: req.body.status
        };

        const order = await Order.create(newOrder);

        return res.send(order);

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

// GETTING ALL RECORDS
orderRouter.get('/', async (req, res) => {
    try {

        const orders = await Order.find({});
        return res.json(orders);

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

// UPDATE ONE RECORD
orderRouter.put('/', async (req, res) => {
    try {
        const updateQuery = {
            serial: req.body.serial
        };

        const updateItem = {
            $inc: {ordered: (req.body.ordered)}
        };

        const item = await hwItem.findOneAndUpdate(updateQuery, updateItem, {new: true});

        return res.send(item);

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

// UPDATE ONE STATUS
orderRouter.put('/status', async (req, res) => {
    try {

        const item = await Order.findByIdAndUpdate(req.body.id, {status: req.body.status}, {new: true});

        return res.send(item);

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})
export default orderRouter;