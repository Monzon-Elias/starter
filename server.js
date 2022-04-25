const app = require('./app');

/*Start Server*/
const port = process.env.PORT;
app.listen(port, () => console.log(`App is running on port ${port}...`));
