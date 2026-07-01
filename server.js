const express = require('express');
const app = express();

// Railway automatically injects the proper port here. Fallback to 8080 locally.
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Standard status API
app.get('/api/status', (req, res) => {
  res.json({ online: true, players: 0 });
});

// Connection test API
app.get('/api/connect', (req, res) => {
  res.json({ status: 'connected', message: 'Server is online!' });
});

// Authentication API
app.post('/api/login', (req, res) => {
  res.json({ success: true, token: 'player123' });
});

// Game client hotfix endpoint required by your game engine configuration
app.get('/cloudstorage/v1/hotfix', (req, res) => {
  res.json({
    hotfixes: [],
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    AntiCheat: {
      enabled: false,
      Signs: []
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running dynamically on port ${PORT}`);
});