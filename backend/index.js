const express = require('express');
const connectDb = require('./db');
const dotenv = require('dotenv');
const cors = require('cors');
const signinRouter = require('./routes/signin');
const loginRouter = require('./routes/login');
const homeRouter = require('./routes/home');

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000; // default port to listen 
app.use(express.json()); // for parsing application/json when using POST
app.use(cors({ origin: '*'})); // for CORS policy to allow all origins to access the API endpoints 
connectDb(); // connect to the database

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/signin', signinRouter); // Main route for signin (registration) page

app.use('/login', loginRouter); // Main route for login page

app.use('/home', homeRouter); // Main route for home page

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});