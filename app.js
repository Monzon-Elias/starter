const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

////////////////////////
/* Global Middlewares */
////////////////////////

/*Serving static files from the server */
app.use(express.static(path.join(__dirname, 'public')));

//Set security HTTP headers (it ads a lot of security headers to the request)
//This options passed as properties to helmet are because the map did not download bc these 2 properties where blocking content to be downloaded
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

//Limiting the amount of requests per hour
const limiter = rateLimit({
  max: 100, //100 requests from 1 IP (increase it if your app needs to do more requests)
  windowMs: 60 * 60 * 1000, //1 hour
  message: 'Too many request from this IP, please try again in 1 hour!',
});

app.use('/api', limiter);

//Body parser, reading data from body into req.body with a limit in the payload
app.use(express.json({ limit: '10kb' }));
//Cookie parser, reading data from the cookies
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against xss (malicious html with js inside)
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

////////////////////////
///////* Routes *///////
////////////////////////

/*Mounting the View Route */
app.use('/', viewRouter);
/*Mounting the Tours Route */
app.use('/api/v1/tours', tourRouter);
/*Mounting the Users Route */
app.use('/api/v1/users', userRouter);
/*Mounting the Reviews Route */
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  //any parameter the next methods receives is an error. It'll skip all other middleware in the stack and send the error to the global error middleware, which will be executed. In this case there's no other middleware after this one, but if it were one or more, it will be skipped and go straight to the one with 4 parameters(error handler middleware)
});

//Middleware handling error
app.use(globalErrorHandler);

module.exports = app;
