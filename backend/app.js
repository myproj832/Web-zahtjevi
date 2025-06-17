const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); // Omogućava CORS (komunikaciju sa frontendom)
app.use(express.json()); // Parsira JSON telo zahteva

// Osnovna test ruta
app.get('/', (req, res) => {
  res.send('Backend je aktivan!');
});

// Primer API ruta za dashboard (možeš razdvojiti kasnije u posebne fajlove)
app.get('/api/dashboard', (req, res) => {
  res.json({ message: 'Pozdrav sa backend dashboard rute!' });
});

// Pokretanje servera
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server je pokrenut na http://localhost:${PORT}`);
});
