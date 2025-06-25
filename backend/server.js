const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const loginRoute = require('./routes/login');

const app = express();
const PORT = 3334

app.use(cors({
  origin: 'http://localhost:5173',  
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));

app.use(bodyParser.json());
app.use('/server', loginRoute);





app.listen(PORT, () => {
  console.log(`API server radi na http://localhost:${PORT}`);
});