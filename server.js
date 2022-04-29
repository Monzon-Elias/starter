const dotenv = require('dotenv');
const mongoose = require('mongoose');
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
const port = process.env.PORT;
app.listen(port, () => console.log(`App is running on port ${port}...`));
