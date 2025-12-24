const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const cors = require('cors');
dotenv.config();

const port = process.env.PORT || 5001;

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use(routes);

app.listen(port, () => {
  console.log(`Server is running on port 'localhost:${port}'`);
});
