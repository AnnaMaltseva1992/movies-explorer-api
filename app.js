require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');

const { errors } = require('celebrate');

const cors = require('cors');

const rateLimit = require('express-rate-limit');

const helmet = require('helmet');

const router = require('./routes');

const handleErrors = require('./middlewares/handleErrors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
app.use(cors());

const {
  MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
  PORT = 3000,
} = process.env;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use(helmet());

app.use(express.json());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  console.log('Слушаю порт 3000');
});
