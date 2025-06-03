const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const path = require('path');
const config = require('./config');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "http://www.wfpccvideo.com", "https://cdn.jsdelivr.net", "data:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"]
    }
  }
}));

// Session middleware
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: config.nodeEnv === 'production',
    httpOnly: true,
    path: '/',
    maxAge: 30 * 60 * 1000 // 30 minutes
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
  const { password } = req.body;
  
  if (password === config.directoryPassword) {
    req.session.authenticated = true;
    res.redirect('/directory');
  } else {
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