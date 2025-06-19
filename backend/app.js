const express = require('express');
const bodyParser = require('body-parser');
const loginRoute = require('./login');

const app = express();
const PORT = 3334

app.use(bodyParser.json());
app.use('/api', loginRoute);





app.listen(PORT, () => {
  console.log(`API server radi na http://localhost:${PORT}`);
});