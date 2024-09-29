const express = require('express');
const sql = require('mssql');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const { json } = require('express');
const { log } = require('console');
const upload = require('../functions/picture.js');
const { sendTransferEmail, updateTransferDocument } = require('../functions/email.js');
// const updateTransferDocument = require('../functions/email.js');


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
    const pool = req.sqlPool;
    try {
        const data = pool.query(`SELECT
    t.transferID,
    t.destination,
    t.date,
    t.recipient,
    t.email,
    t.status,
    t.transferDocument,
    t.type,
    STRING_AGG(CONCAT(ti.itemName, ':', ti.quantity), ', ') AS items
    FROM transfers t
    JOIN transferItems ti
    ON t.transferID = ti.transferID
    GROUP BY t.transferID, t.destination, t.date, t.recipient, t.email, t.status, t.transferDocument, t.type`);

        // const data = pool.query(query);
        data.then((res1) => {
            return res.json(res1)
        })

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

transferRoute.get('/labs', async (req, res) => {
    const pool = req.sqlPool;

    try {
        const data = pool.query(`SELECT labCode from LABS`);
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
    const pool = req.sqlPool;
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
    const pool = req.sqlPool;

    const {info, items} = req.body;
    console.log("type is",info.type);
    let status = info.type === "Transfer" ? "Pending" : "On Loan";

    if (info.destination.includes('Counter') || info.destination.includes('Cabinet')) {
        status = "Acknowledged";
    }

    try {
        
        const result = await pool.query(`INSERT INTO transfers (type, date, destination, recipient, email, status) 
        VALUES ('${info.type}', '${info.date}', '${info.destination}', '${info.recipient}', '${info.email}', '${status}')
        SELECT SCOPE_IDENTITY() AS transferID`)
        
        const transferID = result.recordset[0].transferID;
        const transferDocument = await sendTransferEmail(info, items, transferID);

        pool.query(`UPDATE transfers
            SET transferDocument =  '${transferDocument}'
            WHERE transferID = ${transferID}`)

        return res.json(result)
        // result.then((res1) => {
        //     return res.json(res1)
        // })
    } catch (error) {
        console.log("error is le " + error.message);
        res.send({message : error.message});
    };
})


// ADDING NEW TRANSFER ITEMS RECORD
transferRoute.post('/newtransfer/additems', async (req, res) => {
    const pool = req.sqlPool;

    const transferID = req.query.transferID;
    const items = req.body;


    try {
        
        items.forEach(item => {

        pool.query(`INSERT INTO transferItems (transferID, itemName, quantity) 
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
    const pool = req.sqlPool;
    try {
        const { itemName } = req.params;
        // Replace this with your actual SQL query to delete the item
        await pool.query(`DELETE FROM warehouse WHERE itemName = ${itemName}`);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// =========================== PUT =========================================

// UPDATE ONE RECORD
transferRoute.put('/', async (req, res) => {
    const pool = req.sqlPool;

    const type = req.query.type;

    try {

        await pool.query(`UPDATE transfers
            SET status = '${req.body.status}'
            WHERE transferID = ${req.body.id}`);

        if (req.body.status === 'Acknowledged') {

            req.body.items.forEach (item => {
                const [itemName, quantity] = item.split(':');
                pool.query(`UPDATE warehouse 
                    SET cabinet = cabinet - ${quantity}
                    WHERE itemName = '${itemName}'`);
            })
        }

        res.status(200).json({ message: 'Items updated successfully' });

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }

})

transferRoute.put('/updateinventory', async (req, res) => {
    const pool = req.sqlPool;

    const type = req.query.type;
    // res.send({message : type});
    
    try {

        if (type === "counter") {

            req.body.forEach (item => {
                pool.query(`UPDATE warehouse 
                    SET cabinet = cabinet - ${item.quantity},
                        counter = counter + ${item.quantity}
                    WHERE itemName = '${item.name}'`);
            })
        }
        
        else if (type === "cabinet") {

            req.body.forEach (item => {
                pool.query(`UPDATE warehouse 
                    SET cabinet = cabinet + ${item.quantity},
                        counter = counter - ${item.quantity}
                    WHERE itemName = '${item.name}'`);
            })

            await pool.query(`UPDATE transfers
                SET status = 'Acknowledged'
                WHERE transferID = ${req.body.id}`);
        }

        res.status(200).json({ message: 'Items updated successfully' });

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }

})

transferRoute.put('/accepttransfer/:transferID', async (req, res) => {

    const pool = req.sqlPool;
    const { transferID } = req.params;
    
    try {
        
        const status = await pool.query(`
            SELECT status
            FROM transfers
            WHERE transferID = ${transferID}
        `)

        if (status.recordset[0].status === "Pending") {
            updateTransferDocument(transferID);

            const result = await pool.query(`
                SELECT *
                FROM transferItems
                WHERE transferID = ${transferID}
            `)
            
            result.recordset.forEach(item => {
                pool.query(`
                    UPDATE warehouse
                    SET cabinet = cabinet - ${item.quantity}
                    WHERE itemName = '${item.itemName}'
                `)
            })

            pool.query(`
                UPDATE transfers
                SET status = 'Acknowledged'
                WHERE transferID = ${transferID}
            `)
        }

        res.status(200).json({ message: 'Items updated successfully' });




    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }

})




module.exports = transferRoute;