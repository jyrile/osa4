const express = require('express');
const mongoose = require('mongoose');

require('express-async-errors');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const app = express();
const cors = require('cors');
const middleware = require('./utils/middleware');
const config = require('./utils/config');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logger = require('./utils/logger');

module.exports = app;

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
                logger.info('connected to Mongo');
        })
        .catch(error => {
                logger.error('error connecting: ', error.message);
        });

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
