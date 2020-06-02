const express = require('express');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(db.getRandom);
app.get('/', (req, res) => {});

app.listen(port);
