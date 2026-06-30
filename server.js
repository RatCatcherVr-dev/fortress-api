const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());

// Status endpoints
app.get('/api/status', (req, res) => {
  res.json({ online: true, players: 0 });
});

app.get('/api/connect', (req, res) => {
  res.json({ status: 'connected', message: 'Server is online!' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  res.json({ success: true, token: 'player123' });
});

// Lightswitch endpoint (used by Lyra/Fortress for feature flags)
app.get('/api/v1/lightswitch', (req, res) => {
  res.json({
    "enabled": true,
    "features": {
      "shop": true,
      "cosmetics": true,
      "matchmaking": true,
      "inventory": true
    }
  });
});

// Cloud storage / hotfix endpoint
app.get('/cloudstorage/v1/hotfix', (req, res) => {
  res.json({
    "hotfixes": [],
    "version": "1.0.0",
    "timestamp": new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
