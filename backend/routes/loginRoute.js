const express = require('express');
const sql = require('mssql');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const { json } = require('express');
const { log } = require('console');
const upload = require('../functions/picture.js');

const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {

    const user = req.body.user;
    const password = req.body.password;

    const userData = await sql.query(`
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

module.exports = loginRouter;