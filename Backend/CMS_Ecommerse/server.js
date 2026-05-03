const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const routes = require('./routes');
const { swaggerUi, specs } = require('./swagger');

const port = process.env.PORT || 5001;

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { apiLimiter } = require('./middlewares/rateLimiter');
app.use('/api', apiLimiter);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api', routes);

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, () => {
  console.log(`Server is running on port 'localhost:${port}'`);
});
