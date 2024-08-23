import express from 'express';
import sql from 'mssql';
import { json } from 'express';

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

    const {sortBy} = req.query;
    let query;
    switch (sortBy) {
        case 'name':
            query = 'select * from transfers order by itemName';
            break;
        case 'quantity':
            query = 'select * from transfers order by quantity';
            break;
        case 'date':
            query = 'select * from transfers order by date';
            break;
        case 'destination':
            query = 'select * from transfers order by destination';
            break;
        default:
            query = 'select * from transfers';
    }

    try {
        // const pool = req.pool;
        // const data = pool.request().query(query)
        // data.then((res1) => {
        //     return res.json(res1)

        // })
        const data = sql.query(query);
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

// ADDING NEW RECORD
transferRoute.post('/', async (req, res) => {

    const {info, items} = req.body;
    // const name = req.body.name;
    // const serial = req.body.serial;
    // const quantity = req.body.quantity;
    try {
        
        items.forEach(item => {
        sql.query(`INSERT INTO transfers (itemName, date, destination, quantity) 
            VALUES ('${item.name}', '${info.date}', '${info.destination}', ${item.quantity})`);
        sql.query(`UPDATE warehouse 
            SET quantity = quantity - ${item.quantity}
            WHERE itemName = '${item.name}'`);

        console.log("sql is done");

        // Configure the mailoptions object
        const mailOptions = {
            from: 'fyp.inventory.system@gmail.com',
            to: 'yihangzzzzz@gmail.com',
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
        };
        
        // Send the email
        req.transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log('Error:', error);
            } else {
            console.log('Email sent:', info.response);
            }
        });
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

// UPDATE ONE RECORD
transferRoute.put('/order', async (req, res) => {

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
transferRoute.put('/lowstock', async (req, res) => {

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


export default transferRoute;