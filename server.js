const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());

// In-memory database (for testing - replace with real DB later)
const users = {};
const accounts = {};

// Status endpoints
app.get('/api/status', (req, res) => {
  res.json({ online: true, players: 0 });
});

app.get('/api/connect', (req, res) => {
  res.json({ status: 'connected', message: 'Server is online!' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password required' });
  }

  // Check if user exists
  if (!users[username] || users[username].password !== password) {
    return res.status(401).json({ success: false, error: 'Invalid username or password' });
  }

  res.json({ 
    success: true, 
    token: `token_${username}_${Date.now()}`,
    accountId: users[username].accountId,
    username: username
  });
});

// Sign up endpoint
app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password required' });
  }

  // Check if user already exists
  if (users[username]) {
    return res.status(400).json({ success: false, error: 'Username already exists' });
  }

  // Create new user
  const accountId = `account_${Date.now()}`;
  users[username] = {
    password: password,
    accountId: accountId,
    createdAt: new Date().toISOString(),
    vbucks: 1000,
    inventory: []
  };

  res.json({ 
    success: true, 
    message: 'Account created successfully',
    token: `token_${username}_${Date.now()}`,
    accountId: accountId,
    username: username
  });
});

// Account creation/registration endpoint (alternative)
app.post('/account/api/public/account', (req, res) => {
  const { username, password, email } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password required' });
  }

  if (users[username]) {
    return res.status(400).json({ success: false, error: 'Username already exists' });
  }

  const accountId = `account_${Date.now()}`;
  users[username] = {
    password: password,
    email: email || '',
    accountId: accountId,
    createdAt: new Date().toISOString(),
    vbucks: 1000,
    inventory: []
  };

  res.json({ 
    success: true,
    account: {
      id: accountId,
      username: username,
      email: email || ''
    }
  });
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

// Player inventory endpoint
app.get('/api/inventory/:accountId', (req, res) => {
  const { accountId } = req.params;
  
  // Find user by accountId
  const user = Object.values(users).find(u => u.accountId === accountId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    accountId: accountId,
    vbucks: user.vbucks,
    inventory: user.inventory || []
  });
});

// V-Bucks endpoint
app.get('/api/vbucks/:accountId', (req, res) => {
  const { accountId } = req.params;
  
  const user = Object.values(users).find(u => u.accountId === accountId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    accountId: accountId,
    vbucks: user.vbucks || 1000
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
