const express = require('express');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
/* Middle wares */
const app = express();
app.use(express.json());

/*Serving static files from the server */
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/*Mounting the Tours Route */
app.use('/api/v1/tours', tourRouter);
/*Mounting the Users Route */
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  //any parameter the next methods receives is an error. It'll skip all other middleware in the stack and send the error to the global error middleware, which will be executed. In this case there's no other middleware after this one, but if it were one or more, it will be skipped and go straight to the one with 4 parameters(error handler middleware)
});

//Middleware handling error
app.use(globalErrorHandler);
module.exports = app;
