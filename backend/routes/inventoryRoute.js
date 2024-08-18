import express from 'express';
import sql from 'mssql';

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

const inventoryRouter = express.Router();

// // ADDING NEW RECORD
// inventoryRouter.post('/', async (req, res) => {
//     try {

//         const newItem = {
//             name: req.body.name,
//             serial: req.body.serial,
//             category: req.body.category,
//             labs: req.body.labs
//         };

//         const item = await Inventory.create(newItem);

//         return res.send(item);

//     } catch (error) {
//         console.log("error is " + error.message);
//         res.send({message : error.message});
//     }
// })

// // GETTING ALL RECORDS
// inventoryRouter.get('/', async (req, res) => {
//     try {

//         const items = await Inventory.find({});
//         return res.json(items);

//     } catch (error) {
//         console.log("error is " + error.message);
//         res.send({message : error.message});
//     }
// })

// GETTING ALL RECORDS
inventoryRouter.get('/', async (req, res) => {

    const {sortBy} = req.query;
    let query;
    switch (sortBy) {
        case 'name':
            query = 'select * from warehouse order by [Item Name]';
            break;
        case 'serial':
            query = 'select * from warehouse order by [Serial Number]';
            break;
        case 'quantity':
            query = 'select * from warehouse order by [Quantity]';
            break;
        default:
            query = 'select * from warehouse';
    }

    try {
        const pool = req.pool;
        const data = pool.request().query(query)
        data.then((res1) => {
            return res.json(res1)

        })

    } catch (error) {
        console.log("error is " + error.message);
        res.send({message : error.message});
    }
})

// ADDING NEW RECORD
inventoryRouter.post('/', async (req, res) => {

    const {name, serial, quantity} = req.body;

    try {
        const pool = req.pool;
        const query = `INSERT INTO warehouse ([Item Name], [Serial Number], Quantity) 
                       VALUES (@name, @serial, @quantity)`;
        const request = pool.request()
        request.input('name', sql.NVarChar, name);
        request.input('serial', sql.NVarChar, serial);
        request.input('quantity', sql.Int, quantity);

        request.query(query);

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
        await sql.query(`DELETE FROM warehouse WHERE [Item Name] = ${itemName}`);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});
// // UPDATE ONE QTY RECORD
// itemRouter.put('/qty', async (req, res) => {
//     try {
//         const updateQuery = {
//             serial: req.body.serial
//         };

//         const updateItem = {
//             $inc: {quantity: (req.body.quantity)}
//         };

//         const item = await hwItem.findOneAndUpdate(updateQuery, updateItem, {new: true});

//         return res.send(item);

//     } catch (error) {
//         console.log("error is " + error.message);
//         res.send({message : error.message});
//     }
// })

// // UPDATE ONE ORDERED RECORD
// itemRouter.put('/ordered', async (req, res) => {
//     try {
//         const updateQuery = {
//             serial: req.body.serial
//         };

//         const updateItem = {
//             $inc: {ordered: (req.body.quantity)}
//         };

//         const item = await hwItem.findOneAndUpdate(updateQuery, updateItem, {new: true});

//         return res.send(item);

//     } catch (error) {
//         console.log("error is " + error.message);
//         res.send({message : error.message});
//     }
// })

export default inventoryRouter;