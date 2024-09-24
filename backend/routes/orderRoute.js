const express = require('express');
const sql = require('mssql');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const { json } = require('express');
const { log } = require('console');
const upload = require('../functions/picture.js');
const { spawn } = require('child_process');

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.resolve();

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
        // const data = sql.query(query);
        const data = sql.query(`SELECT
            o.orderID,
			o.poNumber,
			o.poDate,
			o.itemName,
			o.status,
            o.quantity,
            o.poDocument,
            SUM(dd.subQuantity) AS deliveredQuantity,
            STRING_AGG(CONCAT(dd.subQuantity, ':', dd.doNumber, ':', dd.doDate, ':', dd.doDocument), ', ') AS items
            FROM orders o
            LEFT JOIN doDetails dd
            ON o.orderID = dd.orderID
            GROUP BY o.orderID,
			o.poNumber,
			o.poDate,
			o.itemName,
			o.status,
            o.quantity,
            o.poDocument`);
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

// GET INFO FROM PO DOCUMENT

orderRouter.post('/scanDocument', upload.single('poDocument'), async (req, res) => {

    const pythonScript = path.join(__dirname, '../functions', 'readDocument.py');
    const pdfFilePath = path.join(__dirname, '../', req.file.path);
    const pythonProcess = spawn('python', [pythonScript, pdfFilePath]);

    let result = '';
    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });
   
    const parsedResult = {};
    pythonProcess.on('close', (code) => {
        if (code === 0) {
            parsedResult = JSON.parse(result);
        // console.log("result is ", result);
        } else {
        //   res.status(500).send('Python script failed');
        console.log("failed sia sian");
        }
        parsedResult['orderDocument'] = req.file.filename;
        res.json({ message: parsedResult });
      });



});

// ================================ POST ==================================================

// ADDING NEW RECORD
orderRouter.post('/neworder', async (req, res) => {

    const info = req.body.info;
    const orders = req.body.items;

    const poDocument = req.body.poDocument;
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
                (itemName, poDate, quantity, poNumber, poDocument)
                VALUES ('${name}', '${poDate}', ${quantity}, '${poNumber}', '${poDocument}')`);

            });

        res.status(200).json({ message: 'Items updated successfully' });

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

orderRouter.post('/newdelivery', upload.single('doDocument'), async (req, res) => {

    const info = req.body.info;
    const deliveryItems = req.body.items;
    // console.log(deliveryItems);
    // const doDocument = req.file.filename;
    const doDocument = req.file ? req.file.filename : ''
    const doDate = info.doDate;
    const doNumber = info.doNumber;
   
    try {
        
        deliveryItems.forEach(item => {

            const orderID = item.orderID;
            const subQuantity = item.subQuantity;
            const itemName = item.itemName;

            // console.log("total is ", +item.totalQuantity, " and deliveted is ",(+item.deliveredQuantity + +subQuantity))
            
            if (+item.totalQuantity === (+item.deliveredQuantity + +subQuantity)) {
                // console.log("done liao");
                
                sql.query(`
                    UPDATE orders
                    SET status = 'Fulfilled'
                    WHERE orderID = ${orderID}
                    `)
            }

            sql.query(`UPDATE warehouse
                SET cabinet = cabinet + ${subQuantity},
                    ordered = ordered - ${subQuantity}
                WHERE itemName = '${itemName}'`);

            sql.query(`
                INSERT INTO doDetails (orderID, doNumber, doDate, doDocument, subQuantity)
                VALUES (${orderID}, '${doNumber}', '${doDate}', '${doDocument}', ${subQuantity})
            `);

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



module.exports = orderRouter;