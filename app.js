require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/Logger');
const ServerError = require('./middlewares/ServerError');
const limiter = require('./middlewares/limiter');

const { PORT = 3001, NODE_ENV, MONGO = 'mongodb://localhost:27017/moviesdb' } = process.env;
const app = express();
const allowedDomains = [
  'https://diploma.frontend.nomoredomains.xyz/',
  'http://diploma.frontend.nomoredomains.xyz/',
  'http://localhost:3000',
];

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedDomains.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', origin);
    const { method } = req;
    const DEFAULT_ALLOWED_METHODS = 'GET,PUT,PATCH,POST,DELETE';
    if (method === 'OPTIONS') {
      const requestHeaders = req.headers['access-control-request-headers'];
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      res.header('Access-Control-Allow-Headers', requestHeaders);
    }
  }
  next();
});

app.use(cors());

mongoose
  .connect(NODE_ENV === 'production' ? MONGO : 'mongodb://localhost:27017/moviesdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('mongo connected'))
  .catch((err) => console.log(err));

app.use(requestLogger);
app.use(limiter);

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('./routes/index'));

app.use(errorLogger);
app.use(errors());
app.use(ServerError);
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
