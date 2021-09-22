require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const { MONGODB_URL, MONGODB_OPTIONS } = require('./utils/mongodb_config');
const { MES_SER_ERR } = require('./utils/constants');
const rateLimiterMiddleware = require('./middlewares/rate-limiter');
const corsMiddleware = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const indexRouter = require('./routes/index');

const app = express();
const { PORT = 3000 } = process.env;

app.use(cors({
  origin: true,
  exposedHeaders: '*',
  credentials: true,
}));

async function appStart() {
  try {
    app.listen(PORT);
    await mongoose.connect(MONGODB_URL, MONGODB_OPTIONS);
  } catch (err) {
    throw new Error(err);
  }
}

app.use(helmet());
app.use(requestLogger);
app.use(rateLimiterMiddleware);
app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use('/', indexRouter);

app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? MES_SER_ERR
      : message,
  });
  next();
});

appStart();
