const express = require('express');
const path = require('path');

const app = express();

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'system'));

// app.use(express.static('system'));
// app.use('/', express.static(path.join(__dirname + '/system')));

app.get('/', (req, res) => {
    res.render("index");
})

app.get('/test', (req, res) => {
    res.send('<h1>this is testing</h1>');
})

app.listen(3000, () => {
    console.log("it works yay")
})