const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

/* Middle wares */
const app = express();
app.use(express.json());

/*Serving static files from the server */
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('hello from the middleware!');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/*Mounting the Tours Route */
app.use('/api/v1/tours', tourRouter);

/*Mounting the Users Route */
app.use('/api/v1/users', userRouter);

/********************************************************************** */
/*CONFIG Mongoose - mongoose & dotenv required in the top
/********************************************************************** */

dotenv.config({ path: './config.env' });
const db = process.env.DB.replace('<PASSWORD>', process.env.DB_PASS);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('db connection successful!');
  });

module.exports = app;
