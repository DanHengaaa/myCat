const path = require('path');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Campus Cat API is running');
});

module.exports = app;