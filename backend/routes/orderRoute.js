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
const { sendFinanceEmail } = require('../functions/email.js');


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.resolve();

const orderRouter = express.Router();

// ========================== GET =============================================

// GETTING ALL RECORDS
orderRouter.get('/', async (req, res) => {
    const pool = req.sqlPool;

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

        // const data = pool.query(`SELECT
        //     o.orderID,
		// 	o.poNumber,
		// 	o.poDate,
		// 	o.itemName,
		// 	o.status,
        //     o.quantity,
        //     o.poDocument,
        //     SUM(dd.subQuantity) AS deliveredQuantity,
        //     STRING_AGG(CONCAT(dd.subQuantity, ':', dd.doNumber, ':', dd.doDate, ':', dd.doDocument, ':', dd.finance), ', ') AS items
        //     FROM orders o
        //     LEFT JOIN doDetails dd
        //     ON o.orderID = dd.orderID
        //     GROUP BY o.orderID,
		// 	o.poNumber,
		// 	o.poDate,
		// 	o.itemName,
		// 	o.status,
        //     o.quantity,
        //     o.poDocument`);
        
        const orders = (await pool.query(`SELECT * FROM orders`)).recordset;
        const doDetails = (await pool.query(`SELECT * from doDetails`)).recordset;

        const ordersDict = {}
        orders.forEach(order => {
            order.items = []
            ordersDict[order.orderID] = order
        })
        doDetails.forEach(doDetail => {
            ordersDict[doDetail.orderID].items.push(doDetail);
        })
        const result = Object.entries(ordersDict).map(([key, order]) => order)
        result.forEach(order => {
            let delivered = 0
            order.items.forEach(subOrder => {
                delivered += subOrder.subQuantity;
            })
            order.deliveredQuantity = delivered;
        })
        
        return res.json(result)

        // data.then((res1) => {
        //     return res.json(res1)
        // })

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

// GET 1 PDF

orderRouter.get('/pdf/:filename', (req, res) => {
    const pool = req.sqlPool;
    const db = req.query.db;
    const { filename } = req.params;
    const options = {
        root: path.join(__dirname, `../documents/${db}`),
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
    const pool = req.sqlPool;
    const db = req.query.db;

    const pythonScript = path.join(__dirname, '../functions', 'readDocument.py');
    const pdfFilePath = path.join(__dirname, `../`, req.file.path);
    const pythonProcess = spawn('python', [pythonScript, pdfFilePath]);

    let result = '';
    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });
   
    let parsedResult = {};
    pythonProcess.on('close', (code) => {
        if (code === 0) {
            parsedResult = JSON.parse(result);
        console.log("result is ", result);
        } else {
        //   res.status(500).send('Python script failed');
        console.log("failed sia sian");
        }
        parsedResult['orderDocument'] = req.file.filename;
        res.json({ message: parsedResult });
      });



});

orderRouter.put('/predictitems', async (req, res) => {
    const pool = req.sqlPool;
    const data = await pool.query(`
        SELECT itemName
        FROM warehouse
    `);
    const dbItemNames = data.recordset.map(row => row.itemName)
    const queryItemNames = req.body.queryItems.map(item => item[0]);;
    const queryItemQuantities = req.body.queryItems.map(item => item[1]);;

    const pythonScript = path.join(__dirname, '../functions', 'predictItem.py');
    // console.log("db items is ", dbItemNames)
    // console.log("query items is ", queryItemNames)
    const pythonProcess = spawn('python', [pythonScript, dbItemNames, queryItemNames, queryItemQuantities]);

    let result = '';
    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    let parsedResult = {};
    pythonProcess.on('close', (code) => {
        if (code === 0) {
            parsedResult = JSON.parse(result);
        console.log("predicted result is ", result);
        } else {
        //   res.status(500).send('Python script failed');
        console.log("failed sia sian");
        }
        res.json({ message: parsedResult });
      });



    // return res.json(dbItemNames)
})

// ================================ POST ==================================================

// ADDING NEW RECORD
orderRouter.post('/neworder', async (req, res) => {
    const pool = req.sqlPool;

    const info = req.body.info;
    const orders = req.body.items;

    const poDocument = req.body.poDocument;
    const poDate = info.poDate;
    const poNumber = info.poNumber;
   
    try {
        
        orders.forEach(order => {

            const name = order.name;
            const quantity = order.quantity;

            pool.query(`UPDATE warehouse
                SET ordered = ordered + ${quantity}
                WHERE itemName = '${name}'`);

            pool.query(`INSERT INTO orders 
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
    const pool = req.sqlPool;

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
                
                pool.query(`
                    UPDATE orders
                    SET status = 'Fulfilled'
                    WHERE orderID = ${orderID}
                    `)
            }

            pool.query(`UPDATE warehouse
                SET cabinet = cabinet + ${subQuantity},
                    ordered = ordered - ${subQuantity}
                WHERE itemName = '${itemName}'`);

            pool.query(`
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

// =================================== PUT ================================================

// UPDATE ONE RECORD
orderRouter.put('/fulfillorder', upload.single('doDocument'), async (req, res) => {
    const pool = req.sqlPool;


    const doDate = req.body.doDate;
    const doNumber = req.body.doNumber;
    const doDocument = req.file.filename;
   
    try {

        req.body.items.forEach( item => {
            pool.query(`UPDATE orders
                SET doNumber = '${doNumber}',
                    doDate = '${doDate}',
                    status = 'Fulfilled',
                    doDocument = '${doDocument}'
                WHERE itemName = '${item.itemName}'`);

            pool.query(`UPDATE warehouse
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

orderRouter.put('/sendfinance', async (req, res) => {
    const pool = req.sqlPool;

    const doNumber = req.body.doNumber;
    const doDocument = req.body.doDocument;

   
    try {

        sendFinanceEmail(doDocument);

        pool.query(`
            UPDATE doDetails
            SET finance = 'Sent'
            WHERE doNumber = '${doNumber}'    
        `);

        res.status(200).json({ message: 'Items updated successfully' });

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }

})



module.exports = orderRouter;