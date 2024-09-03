import express from 'express';
import sql from 'mssql';
import { json } from 'express';
import upload from '../functions/picture.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const orderRouter = express.Router();

// ========================== GET =============================================

// GETTING ALL RECORDS
orderRouter.get('/', async (req, res) => {

    const {sortBy} = req.query;
    let query;
    switch (sortBy) {
        case 'name':
            query = 'select * from orders order by itemName';
            break;
        case 'quantity':
            query = 'select * from orders order by quantity';
            break;
        default:
            query = 'select * from orders';
    }

    try {
        const data = sql.query(query);
        data.then((res1) => {
            return res.json(res1)
        })

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

// GET 1 PDF

orderRouter.get('/pdf/:filename', (req, res) => {
    const { filename } = req.params;
    const options = {
        root: path.join(__dirname, '../images'),
    };
  
    res.sendFile(filename, options, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(404).send('File not found');
      }
    });
  });

// ================================ POST ==================================================

// ADDING NEW RECORD
orderRouter.post('/neworder', upload.single('poDocument'), async (req, res) => {

    const info = req.body.info;
    const orders = req.body.items;

    const poDocument = req.file.filename;
    const poDate = info.poDate;
    const poNumber = info.poNumber;
   
    try {
        
        orders.forEach(order => {

            const name = order.name;
            const quantity = order.quantity;

            sql.query(`UPDATE warehouse
                SET ordered = ordered + ${quantity}
                WHERE itemName = '${name}'`);

            sql.query(`INSERT INTO orders 
                (itemName, poDate, quantity, doDate, poNumber, poDocument)
                VALUES ('${name}', '${poDate}', ${quantity}, null, '${poNumber}', '${poDocument}')`);

            });

        res.status(200).json({ message: 'Items updated successfully' });

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

// // DELETE ONE RECORD
// orderRouter.delete('/:itemName', async (req, res) => {
//     try {
//         const { itemName } = req.params;
//         // Replace this with your actual SQL query to delete the item
//         await sql.query(`DELETE FROM warehouse WHERE itemName = ${itemName}`);
//         res.status(200).json({ message: 'Item deleted successfully' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to delete item' });
//     }
// });

// // UPDATE ONE RECORD
// orderRouter.put('/order', async (req, res) => {

//     const orders = req.body;
   
//     try {
        
//         orders.forEach(order => {

//             const name = order.name;
//             const ordered = order.quantity;
//             sql.query(`UPDATE warehouse
//                 SET ordered = ordered + ${ordered}
//                 WHERE itemName = '${name}'`);
//             })

//         res.status(200).json({ message: 'Items updated successfully' });

//     } catch (error) {
//         console.log("error is " + error.message);
//         res.send({message : error.message});
//     }

// })

// =================================== PUT ================================================

// UPDATE ONE RECORD
orderRouter.put('/fulfillorder', upload.single('doDocument'), async (req, res) => {


    const doDate = req.body.doDate;
    const doNumber = req.body.doNumber;
    const doDocument = req.file.filename;
   
    try {

        req.body.items.forEach( item => {
            sql.query(`UPDATE orders
                SET doNumber = '${doNumber}',
                    doDate = '${doDate}',
                    status = 'Fulfilled',
                    doDocument = '${doDocument}'
                WHERE itemName = '${item.itemName}'`);

            sql.query(`UPDATE warehouse
                SET cabinet = cabinet + ${item.quantity},
                    ordered = ordered - ${item.quantity}
                WHERE itemName = '${item.itemName}'`);
        })
        res.status(200).json({ message: 'Items updated successfully' });

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }

})


export default orderRouter;