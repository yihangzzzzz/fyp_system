import express from 'express';
import { Part } from '../models/partModel.js';

const router = express.Router();


// ADDING NEW RECORD
router.post('/', async (req, res) => {
    try {

        const newPart = {
            name: req.body.name,
            serial: req.body.serial
        };

        const part = await Part.create(newPart);

        return res.send(part);

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

// GETTING ALL RECORDS
router.get('/', async (req, res) => {
    try {

        const parts = await Part.find({});
        return res.json(parts);

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

// GETTING ONE RECORD BY PARAMETER
router.get('/:serial', async (req, res) => {
    try {
        const {serial} = req.params;
        const parts = await Part.findOne({serial: serial});
        return res.json(parts);

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

// UPDATING ONE RECORD
router.put('/:serial', async (req, res) => {
    try {
        const {serial} = req.params;
        const parts = await Part.findOneAndUpdate({serial: serial}, req.body);
        return res.send({ reply : "update cheng gong"});

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

// DELETING RECORD
router.delete('/:serial', async (req, res) => {
    try {
        const {serial} = req.params;
        const parts = await Part.findOneAndDelete({serial: serial}, req.body);
        return res.send({ reply : "delete done weh weh"});

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

export default router;