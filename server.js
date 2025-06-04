const express = require('express');
const session = require('express-session');
const path = require('path');
const config = require('./config');

const app = express();

// Basic security headers (without helmet to avoid IP-based access issues)
app.use((req, res, next) => {
  // Only set essential security headers that don't interfere with IP access
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // CSP that allows the necessary resources
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' http://www.wfpccvideo.com https://cdn.jsdelivr.net data:; " +
    "script-src 'self'; " +
    "connect-src 'self'"
  );
  
  next();
});

// Session middleware
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Always false for HTTP access, regardless of NODE_ENV
    httpOnly: true,
    path: '/',
    maxAge: 30 * 60 * 1000, // 30 minutes
    sameSite: 'lax' // Allow cross-site requests for better remote access
  }
}));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files (for images and assets)
app.use('/assets', express.static(path.join(__dirname, 'public')));

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Routes
app.get('/', (req, res) => {
  if (req.session.authenticated) {
    res.redirect('/directory');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  if (req.session.authenticated) {
    res.redirect('/directory');
  } else {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
  }
});

app.post('/login', (req, res) => {
  console.log('Login attempt received');
  console.log('Request body:', req.body);
  console.log('Password provided:', req.body.password);
  console.log('Expected password:', config.directoryPassword);
  
  const { password } = req.body;
  
  if (password === config.directoryPassword) {
    console.log('Password correct, setting session');
    req.session.authenticated = true;
    console.log('Session after setting:', req.session);
    res.redirect('/directory');
  } else {
    console.log('Password incorrect, redirecting to login with error');
    res.redirect('/login?error=1');
  }
});

app.get('/directory', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'directory.html'));
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
    }
    res.redirect('/login');
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Waterfront Directory server running on port ${PORT}`);
  console.log(`📂 Access at: http://localhost:${PORT}`);
  console.log(`🔐 Password: ${config.directoryPassword}`);
}); 