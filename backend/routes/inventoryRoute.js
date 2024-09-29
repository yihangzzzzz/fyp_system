const express = require('express');
const sql = require('mssql');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const { json } = require('express');
const { log } = require('console');
const upload = require('../functions/picture.js');

const inventoryRouter = express.Router();

// ======================================= GET =============================================

// GETTING ALL RECORDS
inventoryRouter.get('/', async (req, res) => {

    // const {sortBy} = req.query;
    // let query;
    // switch (sortBy) {
    //     case 'name':
    //         query = 'select * from warehouse order by itemName';
    //         break;
    //     case 'serial':
    //         query = 'select * from warehouse order by serialNumber';
    //         break;
    //     case 'quantity':
    //         query = 'select * from warehouse order by cabinet';
    //         break;
    //     default:
    //         query = 'select * from warehouse';
    // }

    try {
        sql.query(`
            SELECT *
            FROM warehouse
        `)
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
        const data = sql.query(`SELECT *
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

        const {name, quantity} = req.body;
        const picture = req.file.filename;

        sql.query(`INSERT INTO warehouse (itemName, cabinet, picture)
                   VALUES ('${name}', ${quantity}, '${picture}')`);

        res.send('Image uploaded and saved to database');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
})

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
    // const serialNumber = req.body.serialNumber;
    const cabinet = req.body.cabinet;
    const counter = req.body.counter;
    const description = req.body.description;
    const ordered = req.body.ordered;
    const lostDamaged = req.body.lostDamaged;
    const remarks = req.body.remarks;



    try {

        sql.query(`UPDATE warehouse
            SET itemName = '${itemName}',
                description = '${description}',
                cabinet = ${cabinet},
                counter = ${counter},
                lostDamaged = ${lostDamaged},
                ordered = ${ordered},
                remarks = '${remarks}',
                picture = '${picture}'
            WHERE itemName = '${oldItemName}'`);
        // if (req.file === true) {
        //     sql.query(`UPDATE warehouse
        //         SET picture = '${req.file.filename}'
        //         WHERE itemName = '${oldItemName}'`);
        // }

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


module.exports = inventoryRouter;