const express = require('express');
const sql = require('mssql');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const { json } = require('express');
const { log } = require('console');
const upload = require('../functions/picture.js');
const { poolHWPromise, poolSWPromise } = require('../config.js');



const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {

    const pool = req.sqlPool;
    console.log("pool is",pool);
    const user = req.body.user;
    const password = req.body.password;
    

    // console.log(pool)

    const userData = await pool.query(`
        SELECT *
        FROM users
        WHERE username = '${user}'
    `);


    if(userData.recordset.length === 0) {
        res.status(401).json({ success: false, message: 'Invalid username la' });
    }
    else if(userData.recordset[0].password === password) {
        res.json({ success: true });
    }
    else {
        res.status(401).json({ success: false, message: 'Incorrect password sian' });
    }
})

loginRouter.post('/newuser', async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    try {
        await sql.query(`
            INSERT INTO users
            (username, password)
            VALUES ('${username}', '${password}')
        `);
        res.send('New user added');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }

})

loginRouter.get('/', async (req, res) => {

    try {
        const userData = sql.query(`
            SELECT *
            FROM users
        `);
        userData.then((res1) => {
            return res.json(res1)
        })

    } catch (error) {
        console.log("error is " + error.message);
    }

})

loginRouter.delete('/:username', async (req, res) => {

    const {username} = req.params

    try {
        await sql.query(`
            DELETE FROM users
            WHERE username = '${username}'
        `)
        res.send('User deleted');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = loginRouter;