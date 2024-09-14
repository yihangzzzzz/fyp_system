const express = require('express');
const sql = require('mssql');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const { json } = require('express');
const { log } = require('console');
const upload = require('../functions/picture.js');
const sendEmail = require('../functions/email.js');


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

const transferRoute = express.Router();

// GETTING ALL RECORDS
transferRoute.get('/', async (req, res) => {



    // const {sortBy} = req.query;
    // let query;
    // switch (sortBy) {
    //     case 'name':
    //         query = 'select * from transfers order by itemName';
    //         break;
    //     case 'quantity':
    //         query = 'select * from transfers order by quantity';
    //         break;
    //     case 'date':
    //         query = 'select * from transfers order by date';
    //         break;
    //     case 'destination':
    //         query = 'select * from transfers order by destination';
    //         break;
    //     default:
    //         query = 'select * from transfers';
    // }

    try {
        // const pool = req.pool;
        // const data = pool.request().query(query)
        // data.then((res1) => {
        //     return res.json(res1)

        // })

        const data = sql.query(`SELECT
    t.transferID,
    t.destination,
    t.date,
    t.recipient,
    t.email,
    t.status,
    STRING_AGG(CONCAT(ti.itemName, ':', ti.quantity), ', ') AS items
    FROM transfers t
    JOIN transferItems ti
    ON t.transferID = ti.transferID
    GROUP BY t.transferID, t.destination, t.date, t.recipient, t.email, t.status`);

        // const data = sql.query(query);
        data.then((res1) => {
            return res.json(res1)
        })

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

transferRoute.get('/labs', async (req, res) => {

    try {
        // const pool = req.pool;
        // const data = pool.request().query(query)
        // data.then((res1) => {
        //     return res.json(res1)

        // })
        const data = sql.query(`SELECT labCode from LABS`);
        data.then((res1) => {
            return res.json(res1)
        })

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

// GET 1 PDF

transferRoute.get('/pdf/:filename', (req, res) => {
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

// ====================== POST ==================================

// ADDING NEW TRANSFER RECORD
transferRoute.post('/newtransfer', async (req, res) => {

    const {info, items} = req.body;
    let status = null;

    if (info.destination.includes('Counter') || info.destination.includes('Cabinet')) {
        status = "Acknowledged"
    }

    try {
        // const transferDocument = sendEmail(info, items);
        console.log("file name is", transferDocument);

        const result = sql.query(`INSERT INTO transfers (date, destination, recipient, email, status, transferDocument) 
        VALUES ('${info.date}', '${info.destination}', '${info.recipient}', '${info.email}', '${status}', '${transferDocument}')
        SELECT SCOPE_IDENTITY() AS transferID`)

        

        result.then((res1) => {
            return res.json(res1)
        })
    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    };
})


// ADDING NEW TRANSFER ITEMS RECORD
transferRoute.post('/newtransfer/additems', async (req, res) => {

    // const {info, items} = req.body;
    const transferID = req.query.transferID;
    // const transferID = parseInt(req.params.transferID);
    const items = req.body;

    // res.status(200).json({ message: transferID });

    // let transferID;

    // sql.query(`INSERT INTO transfers (date, destination, recipient) 
    //     VALUES ('${info.date}', '${info.destination}', '${info.recipient}')
    //     SELECT SCOPE_IDENTITY() AS transferID`)
    //     .then((res1) => {
    //         transferID = res1;
    //     });

    // res.status(200).json({ message: transferID });

    // const transferID = result.recordset[0].transferID;

    // // const name = req.body.name;
    // // const serial = req.body.serial;
    // // const quantity = req.body.quantity;
    try {
        
        items.forEach(item => {

        // const result = sql.query(`INSERT INTO transfers (date, destination, recipient) 
        // VALUES ('${info.date}', '${info.destination}', '${info.recipient}')
        // SELECT SCOPE_IDENTITY() AS transferID`)


        sql.query(`INSERT INTO transferItems (transferID, itemName, quantity) 
            VALUES (${transferID}, '${item.name}', ${item.quantity})`);
    })
    
    res.status(200).json({ message: 'Items updated successfully' });
    
    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    };
})
// DELETE ONE RECORD
transferRoute.delete('/:itemName', async (req, res) => {
    try {
        const { itemName } = req.params;
        // Replace this with your actual SQL query to delete the item
        await sql.query(`DELETE FROM warehouse WHERE itemName = ${itemName}`);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// =========================== PUT =========================================

// UPDATE ONE RECORD
transferRoute.put('/', async (req, res) => {

    const type = req.query.type;

    try {

        await sql.query(`UPDATE transfers
            SET status = '${req.body.status}'
            WHERE transferID = ${req.body.id}`);

        if (req.body.status === 'Acknowledged') {

            req.body.items.forEach (item => {
                const [itemName, quantity] = item.split(':');
                sql.query(`UPDATE warehouse 
                    SET cabinet = cabinet + ${quantity}
                    WHERE itemName = '${itemName}'`);
            })
        }


        // await sql.query(`UPDATE transfers
        //     SET status = 'Cancelled'
        //     WHERE transferID = 3`);


        res.status(200).json({ message: 'Items updated successfully' });

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }

})

transferRoute.put('/updateinventory', async (req, res) => {

    const type = req.query.type;
    // res.send({message : type});
    
    try {

        if (type === "counter") {

            req.body.forEach (item => {
                sql.query(`UPDATE warehouse 
                    SET cabinet = cabinet - ${item.quantity},
                        counter = counter + ${item.quantity}
                    WHERE itemName = '${item.name}'`);
            })
        }
        
        else if (type === "cabinet") {

            req.body.forEach (item => {
                sql.query(`UPDATE warehouse 
                    SET cabinet = cabinet + ${item.quantity},
                        counter = counter - ${item.quantity}
                    WHERE itemName = '${item.name}'`);
            })

            await sql.query(`UPDATE transfers
                SET status = 'Acknowledged'
                WHERE transferID = ${req.body.id}`);
        }

        res.status(200).json({ message: 'Items updated successfully' });

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }

})





module.exports = transferRoute;