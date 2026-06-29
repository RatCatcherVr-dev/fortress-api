const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get('/api/status', (req, res) => {
  res.json({ online: true, players: 0 });
});

app.get('/api/connect', (req, res) => {
  res.json({ status: 'connected', message: 'Server is online!' });
});

app.post('/api/login', (req, res) => {
  res.json({ success: true, token: 'player123' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});