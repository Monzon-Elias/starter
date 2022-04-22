const fs = require('fs');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

/* Middlewares */
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

app.param('id', (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (+req.params.id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

/*Functions handlers */
/*Tours*/
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

const getOneTour = (req, res) => {
  const id = req.params.id * 1; //by multiplying by 1, it converts the string into a number
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(200).json({ status: 'success', data: { tour } });
};

const postNewTour = (req, res) => {
  console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    }
  );
};

const updateTour = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', data: { tour: '<Updated tour here...>' } });
};

const deleteTour = (req, res) => {
  res.status(204).json({ status: 'success', data: null });
};

/*Users*/
const getAllUsers = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet implemented' });
};

const getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet implemented' });
};

const updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet implemented' });
};

const postUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet implemented' });
};

const deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet implemented' });
};
//app.get('/api/v1/tours', getAllTours);
//app.get('/api/v1/tours/:id', getOneTour);
//app.post('/api/v1/tours', postNewTour);
//app.patch('/api/v1/tours/:id', updateTour);
//app.delete('/api/v1/tours/:id', deleteTour);

/*Routes */
/*Tours */
app.route('/api/v1/tours').get(getAllTours).post(postNewTour);

app
  .route('/api/v1/tours/:id')
  .get(getOneTour)
  .patch(updateTour)
  .delete(deleteTour);

/*Users */
app.route('/api/v1/users').get(getAllUsers).post(postUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

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
  .then((con) => {
    console.log(con.connections);
    console.log('db connection successful!');
  });
/*Schema */
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});
/*Model*/
const Tour = mongoose.model('Tour', tourSchema);

/*Instance of the Model*/
const testTour = new Tour({
  name: 'The Park Camper',
  price: 323,
});
/*Saving it on the db*/
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('ERROR:', err);
  });

const port = process.env.PORT;
app.listen(port, () => console.log(`App is running on port ${port}...`));
