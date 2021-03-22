/* eslint-disable no-param-reassign */
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
const port = 8000;
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

app.get('/styles/:params', (req, res) => {
  const { params } = req.params;
  client.query('SELECT id AS style_id, name, sale_price, original_price, default_style FROM styles WHERE product_id = ($1)', [params])
    .then((results) => {
      const promiseArray = [];
      results.rows.map((style) => {
        const queryStr = `SELECT id, quantity, size FROM skus WHERE style_id = ${style.style_id};
                           SELECT thumbnail_url, url FROM photos WHERE style_id = ${style.style_id}`;
        const promise = client.query(queryStr)
          .then((data) => {
            const skuObj = {};
            for (let j = 0; j < data[0].rows.length; j += 1) {
              // eslint-disable-next-line prefer-destructuring
              const id = data[0].rows[j].id;
              const skuInfo = {};
              skuInfo.size = data[0].rows[j].size;
              skuInfo.quantity = data[0].rows[j].quantity;
              skuObj[id] = skuInfo;
            }
            style.photos = data[1].rows;
            style.skus = skuObj;
            return style;
          })
          .catch((err) => console.log(err));
        promiseArray.push(promise);
      });
      return Promise.all(promiseArray);
    })
    .then((results) => {
      const styleObj = {};
      styleObj.product_id = params;
      styleObj.results = results;
      res.send(styleObj);
    })
    .catch((err) => console.log(err));
});

app.get('/', (req, res) => {
  res.send('Hello World again!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
