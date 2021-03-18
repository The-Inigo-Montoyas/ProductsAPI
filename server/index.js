const express = require('express');
const { Client } = require('pg');

const client = new Client({
  user: '',
  host: 'localhost',
  database: 'sdc',
  port: 5432,
});

client.connect();

const app = express();
const port = 3000;
const morgan = require('morgan');

app.use(express.json());
app.use(morgan('dev'));

app.get('/product', (req, res) => {
  // const id = req.query;
  client.query('SELECT * FROM product WHERE id=2')
    .then((results) => res.send(results.rows))
    .catch((err) => console.log(err));
});

app.get('/', (req, res) => {
  res.send('Hello World again!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
