import express from 'express';
import sql from 'mssql';
import multer from 'multer';
import fs from 'fs';
import bodyParser from 'body-parser';
import path from 'path';
import { json } from 'express';
import { log } from 'console';
import upload from '../functions/picture.js';


const sqlConfig = {
    server: 'DESKTOP-VN9PRPU\\SQLEXPRESS', // or 'localhost' for a local instance
    database: 'inventory',
    driver: 'msnodesqlv8',
    options: {
        // encrypt: false,
        // trustServerCertificate: true,
        trustedConnection: true
    }
};

// const storage = multer.diskStorage({
//     destination: (req, fily, cb) => {
//       cb(null, 'images');
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
//     },
//   });

//   const upload = multer ({
//     storage: storage
//   })

const inventoryRouter = express.Router();

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
            query = 'select * from warehouse order by quantity';
            break;
        default:
            query = 'select * from warehouse';
    }

    try {
        // const pool = req.pool;
        // const data = pool.request().query(query)
        // data.then((res1) => {
        //     return res.json(res1)

        // })
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
        const data = sql.query(`SELECT picture, serialNumber, itemName, quantity
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

inventoryRouter.post('/newitem', upload.single('picture'), async (req, res) => {

    try {

        const {name, serial, quantity} = req.body;
        const picture = req.file.filename;

        // res.status(200).json({ message: 'Item added successfully', image: req.file });
        // const file = req.file;
        // res.send('Image uploaded and saved to database', file.filename);
        // Read the uploaded file data
        // const arrayBuffer = e.arrayBuffer();
        

        // Create a connection pool
        // const pool = await sql.connect(config);

        // Insert the binary data into the database
        // await pool.request()
        //     .input('ImageData', sql.VarBinary(sql.MAX), imageData)
        //     .query('INSERT INTO Images (ImageData) VALUES (@ImageData)');
        sql.query(`INSERT INTO warehouse (itemName, quantity, serialNumber, picture)
                   VALUES ('${name}', ${quantity}, ${serial}, '${picture}')`);

        res.send('Image uploaded and saved to database');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
})


// ADDING NEW RECORD
inventoryRouter.post('/', async (req, res) => {

    const name = req.body.name;
    const serial = req.body.serial;
    const quantity = req.body.quantity;
    const picture = req.file.buffer;
    // const name = req.body.name;
    // const serial = req.body.serial;
    // const quantity = req.body.quantity;

    try {
        // const pool = req.pool;
        // const query = `INSERT INTO warehouse (itemName, serialNumber, quantity) 
        //                VALUES (${name}, ${serial}, ${quantity})`;
            const query = `INSERT INTO warehouse (picture, itemName, serialNumber, quantity) 
                    VALUES (${picture}, '${name}', ${serial}, ${quantity})`;
        // const request = pool.request()
        // request.input('name', sql.NVarChar, name);
        // request.input('serial', sql.NVarChar, serial);
        // request.input('quantity', sql.Int, quantity);

        // request.query(query);
        sql.query(query);
        res.status(200).json({ message: 'Item added successfully' });

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

// DELETE ONE RECORD
inventoryRouter.delete('/:itemName', async (req, res) => {
    try {
        const { itemName } = req.params;
        // Replace this with your actual SQL query to delete the item
        await sql.query(`DELETE FROM warehouse WHERE itemName = '${itemName}'`);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// UPDATE ONE RECORD
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

// UPDATE ONE RECORD
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

inventoryRouter.put('/:itemName', upload.single('picture'), async (req, res) => {

    const oldItemName = req.params.itemName;
    // const picture = req.file ? req.file.filename : req.body.picture
    const itemName = req.body.itemName;
    const serialNumber = req.body.serialNumber;
    const quantity = req.body.quantity

    try {
        sql.query(`UPDATE warehouse
            SET itemName = '${itemName}',
                serialNumber = ${serialNumber},
                quantity = ${quantity},
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