const express = require('express');
const app = express();

// Railway automatically injects the proper port here. Fallback to 8080 locally.
const PORT = process.env.PORT || 8080;

app.use(express.json());

<<<<<<< HEAD
// Standard status API
=======
// In-memory database (for testing - replace with real DB later)
const users = {};
const accounts = {};

// In-memory request log (stores last 100 requests)
const requestLog = [];
const MAX_LOG_SIZE = 100;

// Middleware to log all requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent') || 'Unknown',
    body: req.method !== 'GET' ? req.body : null,
    status: null
  };

  // Intercept response to capture status
  const originalSend = res.send;
  res.send = function(data) {
    logEntry.status = res.statusCode;
    logEntry.response = data;
    
    // Add to log
    requestLog.unshift(logEntry);
    if (requestLog.length > MAX_LOG_SIZE) {
      requestLog.pop();
    }

    // Console log for Railway logs
    console.log(`[${timestamp}] ${req.method} ${req.path} - Status: ${res.statusCode} - IP: ${req.ip}`);
    
    return originalSend.call(this, data);
  };

  next();
});

// Status endpoints
>>>>>>> 6f19af4d8e8cbe3dcb96c0dae1e1ca810511697b
app.get('/api/status', (req, res) => {
  res.json({ online: true, players: 0 });
});

// Connection test API
app.get('/api/connect', (req, res) => {
  res.json({ status: 'connected', message: 'Server is online!' });
});

<<<<<<< HEAD
// Authentication API
=======
// Login endpoint
>>>>>>> 6f19af4d8e8cbe3dcb96c0dae1e1ca810511697b
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

// Cloud storage / hotfix endpoint - FIXED FORMAT
app.get('/cloudstorage/v1/hotfix', (req, res) => {
  res.json({
    "hotfixes": [],
    "version": "1.0.0",
    "timestamp": new Date().toISOString(),
    "AntiCheat": {
      "enabled": false,
      "Signs": []
    }
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

// NEW: Request log viewer endpoint
app.get('/logs', (req, res) => {
  res.json({
    totalRequests: requestLog.length,
    requests: requestLog
  });
});

// NEW: Request log as HTML (web view)
app.get('/logs-web', (req, res) => {
  const htmlLog = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Fortress API Request Log</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #1e1e1e; color: #fff; }
        h1 { color: #4CAF50; }
        table { width: 100%; border-collapse: collapse; background: #2a2a2a; }
        th, td { padding: 10px; text-align: left; border: 1px solid #444; }
        th { background: #3a3a3a; color: #4CAF50; }
        tr:hover { background: #3a3a3a; }
        .method-GET { color: #90CAF9; }
        .method-POST { color: #81C784; }
        .status-200 { color: #4CAF50; }
        .status-400 { color: #FFA726; }
        .status-401 { color: #EF5350; }
        .timestamp { font-size: 0.9em; color: #aaa; }
      </style>
      <meta http-equiv="refresh" content="5">
    </head>
    <body>
      <h1>🎮 Fortress API Request Log</h1>
      <p>Total Requests: <strong>${requestLog.length}</strong></p>
      <p><small>Auto-refreshes every 5 seconds</small></p>
      <table>
        <tr>
          <th>Timestamp</th>
          <th>Method</th>
          <th>Endpoint</th>
          <th>Status</th>
          <th>IP Address</th>
          <th>User Agent</th>
        </tr>
        ${requestLog.map(log => `
          <tr>
            <td class="timestamp">${log.timestamp}</td>
            <td class="method-${log.method}">${log.method}</td>
            <td><strong>${log.path}</strong></td>
            <td class="status-${log.status}">${log.status}</td>
            <td>${log.ip}</td>
            <td>${log.userAgent.substring(0, 50)}...</td>
          </tr>
        `).join('')}
      </table>
    </body>
    </html>
  `;
  res.send(htmlLog);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
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
<<<<<<< HEAD
  console.log(`Server running dynamically on port ${PORT}`);
});
=======
  console.log(`Server running on port ${PORT}`);
});
>>>>>>> 6f19af4d8e8cbe3dcb96c0dae1e1ca810511697b
