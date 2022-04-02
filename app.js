require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middlewares/Logger');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/movies');
const { login, createUser } = require('./controllers/users');
const ServerError = require('./middlewares/ServerError');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('mongo connected'))
  .catch((err) => console.log(err));

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser,
);

app.use(requestLogger);

app.use('/', auth, usersRouter);
app.use('/', auth, cardsRouter);

app.all('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use(errors());

app.use(ServerError);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
