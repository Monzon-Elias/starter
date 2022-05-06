const dotenv = require('dotenv');
const mongoose = require('mongoose');

//It is good practice to handle unhandled rejections at the beginning of the server, specially before the app.
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 🤯 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

/*CONFIG Mongoose - mongoose & dotenv required in the top*/

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
/*Start Server*/
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`App is running on port ${port}...`)
);

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 🤯 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
