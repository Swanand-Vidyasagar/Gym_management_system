const express = require('express');
const cors = require('cors');
const { sequelize, testConnection } = require('./config/database');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - helpful info with HTML for browser viewing
app.get('/', (req, res) => {
  // Check if request accepts HTML (browser) or JSON (API client)
  const acceptHeader = req.headers.accept || '';
  
  if (acceptHeader.includes('text/html')) {
    // Return HTML for browser viewing
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Gym Management System API</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #1a1a1a; color: #fff; }
          h1 { color: #4CAF50; }
          .status { background: #2a2a2a; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .endpoint { background: #333; padding: 10px; margin: 10px 0; border-left: 3px solid #4CAF50; }
          a { color: #4CAF50; text-decoration: none; }
          a:hover { text-decoration: underline; }
          code { background: #222; padding: 2px 5px; border-radius: 3px; }
          .test-link { display: inline-block; margin-top: 10px; padding: 8px 15px; background: #4CAF50; color: white; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>🏋️ Gym Management System API</h1>
        <div class="status">
          <strong>✅ Status:</strong> Server is running successfully!
        </div>
        
        <h2>Available Endpoints:</h2>
        <div class="endpoint">
          <strong>Health Check:</strong> <a href="/api/health">/api/health</a>
          <br><a href="/api/health" class="test-link">Test Health Check →</a>
        </div>
        
        <div class="endpoint">
          <strong>Authentication:</strong>
          <ul>
            <li><code>POST /api/auth/register</code> - Register new user</li>
            <li><code>POST /api/auth/login</code> - Login user</li>
            <li><code>GET /api/auth/me</code> - Get current user (requires auth)</li>
          </ul>
        </div>
        
        <div class="endpoint">
          <strong>Other Endpoints:</strong>
          <ul>
            <li><code>/api/users</code> - User management</li>
            <li><code>/api/memberships</code> - Membership management</li>
            <li><code>/api/payments</code> - Payment management</li>
            <li><code>/api/staff</code> - Staff management</li>
            <li><code>/api/dashboard</code> - Dashboard analytics</li>
          </ul>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #2a2a2a; border-radius: 5px;">
          <strong>📚 Documentation:</strong>
          <br>See <code>backend/README.md</code> or <code>backend/API_DOCUMENTATION.md</code>
          <br><br>
          <strong>🧪 Quick Test:</strong>
          <br>Visit <a href="/api/health">/api/health</a> to verify the API is working.
        </div>
      </body>
      </html>
    `);
  } else {
    // Return JSON for API clients
    res.json({
      success: true,
      message: 'Gym Management System API is running',
      version: '1.0.0',
      status: 'operational',
      baseUrl: 'http://localhost:3001/api',
      endpoints: {
        health: 'GET /api/health',
        auth: {
          register: 'POST /api/auth/register',
          login: 'POST /api/auth/login',
          me: 'GET /api/auth/me'
        },
        users: 'GET /api/users (requires auth)',
        memberships: 'GET /api/memberships (requires auth)',
        payments: 'GET /api/payments (requires auth)',
        staff: 'GET /api/staff (requires auth & admin)',
        dashboard: 'GET /api/dashboard/stats (requires auth & admin)'
      },
      documentation: 'See backend/README.md or backend/API_DOCUMENTATION.md',
      quickTest: 'Visit /api/health to verify the API is working'
    });
  }
});

// Import routes
const routes = require('./routes');

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}/api`);
      console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;

