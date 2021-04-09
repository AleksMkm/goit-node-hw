const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const contactsRouter = require('./routes/api/contacts/');
const authRouter = require('./routes/api/users');
const { HttpCode, Status } = require('./helpers/constants');
const swaggerDocument = require('./swagger.json');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
const PUBLIC_DIR = process.env.PUBLIC_DIR;

app.use(express.static(path.join(__dirname, PUBLIC_DIR)));
app.get('env') !== 'test' && app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/api/auth', authRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, _req, res, _next) => {
  res.status(err.status || HttpCode.INTERNAL_SERVER_ERROR).json({
    status: Status.ERROR,
    code: err.status || HttpCode.INTERNAL_SERVER_ERROR,
    message: err.message,
  });
});

module.exports = app;
