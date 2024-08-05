console.log("tytyt")

const express = require('express');

const app = express();

app.use(express.static('system'));

app.listen(3000, () => {
    console.log("it works yay")
})