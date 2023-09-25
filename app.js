const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('dotenv').config();

// const contactsRouter = require('./routes/api/contacts');
const authRouter = require('./routes/api/auth');

const userProductsRouter = require('./routes/api/userProducts');
const userDataProductsRouter = require('./routes/api/userDataProductsRoute');
const calculateNormsRouter = require('./routes/api/calculateNorms');
const productsRouter = require('./routes/api/productsRoute');
const productCategoriesRoute = require('./routes/api/productCategoriesRoute');
const exercisesRouter = require('./routes/api/exercises');
const userExercisesRouter = require('./routes/api/userExercises');
const userDataRouter = require('./routes/api/userData');
const filtersRouter = require('./routes/api/filters');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRouter);
app.use('/api/userData', userDataRouter);
app.use('/api/users', authRouter);
app.use('/api/userDataProducts', userDataProductsRouter);

// app.use('/api/contacts', contactsRouter);
app.use('/api/calculateNorms', calculateNormsRouter);

app.use('/api/filters', filtersRouter);

app.use('/api/products', productsRouter);
app.use('/api/userproducts', userProductsRouter);
app.use('/api/categories', productCategoriesRoute);
app.use('/api/exercises', exercisesRouter);
app.use('/api/userExercises', userExercisesRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});
app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;
