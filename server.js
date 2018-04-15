'use strict';

const express = require('express');
const path    = require('path');

const PORT  = process.env.PORT || 3000;
const INDEX = path.join(__dirname + '/dist', 'index.html');

const app = express();

app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req, res) {
    res.sendFile(INDEX);
  });

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));