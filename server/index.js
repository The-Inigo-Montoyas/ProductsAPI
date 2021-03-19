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

app.get('/product/:params', (req, res) => {
  const { params } = req.params;
  client.query('SELECT * FROM product WHERE id = ($1)', [params])
    .then((results) => {
      client.query('SELECT feature, value FROM features WHERE product_id = ($1)', [params])
        .then((data) => {
          const featureValue = data.rows;
          // eslint-disable-next-line no-param-reassign
          results.rows[0].features = featureValue;
          res.send(results.rows[0]);
        })
        .catch((err) => console.log('err getting features', err));
    })
    .catch((err) => res.send(err));
});

app.get('/styles/:params', (req, res, next) => {
  const { params } = req.params;
  client.query('SELECT id AS style_id, name, sale_price, original_price, default_style FROM styles WHERE product_id = ($1)', [params])
    .then((results) => {
      const styleObj = {};
      styleObj.product_id = params;
      styleObj.results = results.rows;
      for (let i = 0; i < results.rows.length; i += 1) {
        client.query('SELECT id, quantity, size FROM skus WHERE style_id = ($1)', [results.rows[i].style_id])
          // eslint-disable-next-line no-loop-func
          .then((data) => {
            const skuObj = {};
            for (let j = 0; j < data.rows.length; j += 1) {
              // eslint-disable-next-line prefer-destructuring
              const id = data.rows[j].id;
              const skuInfo = {};
              skuInfo["size"] = data.rows[j].size;
              skuInfo["quantity"] = data.rows[j].quantity;
              skuObj[id] = skuInfo;
            }
            // eslint-disable-next-line no-param-reassign
            results.rows[i].skus = skuObj;
            // console.log(results.rows[i]);
            console.log(styleObj);
            res.send(styleObj);
          })
          .catch((err) => res.send(err));
      }
      // res.send(styleObj);
    })
    .catch((err) => res.send(err));
});

app.get('/', (req, res) => {
  res.send('Hello World again!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
