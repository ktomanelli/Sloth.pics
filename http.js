const express = require('express');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.static('public'));
app.use('/api', db.getRandom);
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});
app.get('/api', (req, res, next) => {});
app.get('/documentation', (req, res) => {
  res.sendFile(`${__dirname}/public/apidoc.html`);
});
app.listen(port);
