import express from 'express';
import sql from 'mssql';
import multer from 'multer';
import fs from 'fs';
import bodyParser from 'body-parser';
import path from 'path';
import { json } from 'express';
import { log } from 'console';
import upload from '../functions/picture.js';

const inventoryRouter = express.Router();

// ======================================= GET =============================================

// GETTING ALL RECORDS
inventoryRouter.get('/', async (req, res) => {

    const {sortBy} = req.query;
    let query;
    switch (sortBy) {
        case 'name':
            query = 'select * from warehouse order by itemName';
            break;
        case 'serial':
            query = 'select * from warehouse order by serialNumber';
            break;
        case 'quantity':
            query = 'select * from warehouse order by cabinet';
            break;
        default:
            query = 'select * from warehouse';
    }

    try {
        sql.query(query)
        .then((res1) => {
            return res.json(res1)
        })

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

// GET 1 RECORD
inventoryRouter.get('/:itemName', async (req, res) => {

    const { itemName } = req.params;

    try {
        const data = sql.query(`SELECT picture, serialNumber, itemName, cabinet, counter
                                FROM warehouse
                                WHERE itemName = '${itemName}'`);
        data.then((res1) => {
            return res.json(res1)
        })

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

// ========================= POST ======================================================================

// ADD 1 ITEM
inventoryRouter.post('/newitem', upload.single('picture'), async (req, res) => {

    try {

        const {name, serial, quantity} = req.body;
        const picture = req.file.filename;

        sql.query(`INSERT INTO warehouse (itemName, cabinet, serialNumber, picture)
                   VALUES ('${name}', ${quantity}, ${serial}, '${picture}')`);

        res.send('Image uploaded and saved to database');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
})


// ADDING NEW RECORD
// inventoryRouter.post('/', async (req, res) => {

//     const name = req.body.name;
//     const serial = req.body.serial;
//     const quantity = req.body.quantity;
//     const picture = req.file.buffer;
//     // const name = req.body.name;
//     // const serial = req.body.serial;
//     // const quantity = req.body.quantity;

//     try {
//         // const pool = req.pool;
//         // const query = `INSERT INTO warehouse (itemName, serialNumber, quantity) 
//         //                VALUES (${name}, ${serial}, ${quantity})`;
//             const query = `INSERT INTO warehouse (picture, itemName, serialNumber, cabinet) 
//                     VALUES (${picture}, '${name}', ${serial}, ${quantity})`;
//         // const request = pool.request()
//         // request.input('name', sql.NVarChar, name);
//         // request.input('serial', sql.NVarChar, serial);
//         // request.input('quantity', sql.Int, quantity);

//         // request.query(query);
//         sql.query(query);
//         res.status(200).json({ message: 'Item added successfully' });

//     } catch (error) {
//         console.log("error is " + error.message);
//         res.send({message : error.message});
//     }
// })

// ================================= DELETE ====================================================

// DELETE ONE RECORD
inventoryRouter.delete('/:itemName', async (req, res) => {
    try {
        const { itemName } = req.params;
        await sql.query(`DELETE FROM warehouse WHERE itemName = '${itemName}'`);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// ===================================== PUT ===================================================

// UPDATE ORDERED QUANTITY
inventoryRouter.put('/order', async (req, res) => {

    const orders = req.body;
   
    try {
        
        orders.forEach(order => {

            const name = order.name;
            const ordered = order.quantity;
            sql.query(`UPDATE warehouse
                SET ordered = ordered + ${ordered}
                WHERE itemName = '${name}'`);
            })

        res.status(200).json({ message: 'Items updated successfully' });

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }

})

// UPDATE LOW STOCK
inventoryRouter.put('/lowstock', async (req, res) => {

    const {name, newLowStock} = req.body;
   
    try {
            sql.query(`UPDATE warehouse
                SET lowStock = ${newLowStock}
                WHERE itemName = '${name}'`);


        res.status(200).json({ message: 'Items updated successfully' });

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }

})

// UPDATE 1 ITEM DETAILS
inventoryRouter.put('/:itemName', upload.single('picture'), async (req, res) => {

    const oldItemName = req.params.itemName;
    const picture = req.file ? req.file.filename : req.body.picture
    const itemName = req.body.itemName;
    const serialNumber = req.body.serialNumber;
    const quantity = req.body.cabinet

    try {
        sql.query(`UPDATE warehouse
            SET itemName = '${itemName}',
                serialNumber = ${serialNumber},
                cabinet = ${quantity},
                picture = '${picture}'
            WHERE itemName = '${oldItemName}'`);

        sql.query(`UPDATE orders
            SET itemName = '${itemName}'
            WHERE itemName = '${oldItemName}'`);

        sql.query(`UPDATE transferItems
            SET itemName = '${itemName}'
            WHERE itemName = '${oldItemName}'`);

            res.send({message : "success"});

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})


export default inventoryRouter;