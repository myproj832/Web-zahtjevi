const cors = require('cors');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const loginRoute = require('./routes/login');

const app = express();
const PORT = 3334
app.use(cors());
app.use(bodyParser.json());
app.use('/api', loginRoute);





app.listen(PORT, () => {
  console.log(`API server radi na http://localhost:${PORT}`);
});