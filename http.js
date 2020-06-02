const express = require('express');
const db = require('./db');

const app = express();

app.use(db.getRandom);
app.get('/', (req, res) => {});

app.listen(3000);
