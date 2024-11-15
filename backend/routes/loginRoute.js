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
const jwt = require('jsonwebtoken');
const secretKey = 'fyp';
const {sendWeeklyLowStock} = require('../functions/email.js')



const loginRouter = express.Router();

// loginRouter.get('/', async (req, res) => {

//     const pool = req.sqlPool;

//     const userData = await pool.query(`
//         SELECT *
//         FROM users
//         WHERE username = 'sw'
//     `);

//     return res.json(userData.recordset)
// })

loginRouter.post('/', async (req, res) => {

    const pool = req.sqlPool;
    const user = req.body.user;
    const password = req.body.password;

    const userData = await pool.query(`
        SELECT *
        FROM users
        WHERE username = '${user}'
    `);

    if(userData.recordset.length === 0) {
        res.status(401).json({ success: false, message: 'Invalid username' });
    }
    else if(userData.recordset[0].password === password) {
        const token = jwt.sign({
            username: userData.recordset[0].username,
            password: userData.recordset[0].password,
            role: userData.recordset[0].role
        }, secretKey)
        res.json({token: token});
    }
    else {
        res.status(401).json({ success: false, message: 'Incorrect password' });
    }
})

loginRouter.post('/newuser', async (req, res) => {
    const pool = req.sqlPool;
    const userRole = req.query.userRole;
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (userRole === 'general') {
            await pool.query(`
                INSERT INTO users
                (username, password, role)
                VALUES ('${username}', '${password}', 'general')
            `);
            res.send('New user added');
        }

        else {
            const swPool = await poolSWPromise;
            await swPool.query(`
                INSERT INTO users
                (username, password, role)
                VALUES ('${username}', '${password}', 'super')
                `)
            const hwPool = await poolHWPromise;
            await hwPool.query(`
                INSERT INTO users
                (username, password, role)
                VALUES ('${username}', '${password}', 'super')
                `)
            res.send('New super user added');
        }

    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }

})

loginRouter.get('/emailtemplates', async (req, res) => {
    const pool = req.sqlPool;

    try {
        const result = pool.query(`
            SELECT *
            FROM emailTemplates
        `);
        result.then((res1) => {
            return res.json(res1)
        })

    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
})

loginRouter.get('/:userRole', async (req, res) => {
    const pool = req.sqlPool;
    const {userRole} = req.params

    try {
        let userData
        if (userRole === 'super') {
            userData = pool.query(`
                SELECT *
                FROM users
                WHERE role = 'super'
            `);
        }
        else {
            userData = pool.query(`
                SELECT *
                FROM users
                WHERE role NOT LIKE 'super'
            `);
        }

        userData.then((res1) => {
            return res.json(res1)
        })

    } catch (error) {
        console.log("error is " + error.message);
    }

})

loginRouter.delete('/:username', async (req, res) => {
    const pool = req.sqlPool;
    const userRole = req.query.userRole;
    const {username} = req.params

    try {

        if (userRole != 'super') {
            await pool.query(`
                DELETE FROM users
                WHERE username = '${username}'
            `)
            res.send('User deleted');
        }

        else {
            const swPool = await poolSWPromise;
            await swPool.query(`
                DELETE FROM users
                WHERE username = '${username}'
            `);
            const hwPool = await poolHWPromise;
            await hwPool.query(`
                DELETE FROM users
                WHERE username = '${username}'
            `);
            res.send('Super User deleted');
        }
        
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
})


loginRouter.put('/editemailtemplates', async (req, res) => {
    const pool = req.sqlPool;

    const transferTemplate = req.body.transferTemplate;
    const financeTemplate = req.body.financeTemplate;
    const lowStockTemplate = req.body.lowStockTemplate;

    try {
        pool.query(`
            UPDATE emailTemplates
            SET subject = '${transferTemplate.subject}',
                message = '${transferTemplate.message}'
            WHERE templateName = 'transfer'
        `);
        pool.query(`
            UPDATE emailTemplates
            SET subject = '${financeTemplate.subject}',
                message = '${financeTemplate.message}',
                email = '${financeTemplate.email}'
            WHERE templateName = 'finance'
        `);
        pool.query(`
            UPDATE emailTemplates
            SET subject = '${lowStockTemplate.subject}',
                message = '${lowStockTemplate.message}',
                email = '${lowStockTemplate.email}',
                day = '${lowStockTemplate.day}',
                time = '${lowStockTemplate.time}'
            WHERE templateName = 'lowStock'
        `);
    } catch (err) {
        console.error('Error updating email templates: ', err)
    }
})

loginRouter.put('/edituser', async (req, res) => {
    const pool = req.sqlPool;
    const userRole = req.query.userRole;
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (userRole != 'super') {
            await pool.query(`
                UPDATE users
                SET password = '${password}'
                WHERE username = '${username}'
            `);
            res.send('User password updated');
        }

        else {
            const swPool = await poolSWPromise;
            await swPool.query(`
                UPDATE users
                SET password = '${password}'
                WHERE username = '${username}'
            `);
            const hwPool = await poolHWPromise;
            await hwPool.query(`
                UPDATE users
                SET password = '${password}'
                WHERE username = '${username}'
            `);
            res.send('Super User password updated');
        }

    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
})

loginRouter.put('/togglealert', async (req, res) => {

    const {toggle} = req.body
    console.log(toggle)
    sendWeeklyLowStock(toggle);
    res.send('success');
})

module.exports = loginRouter;