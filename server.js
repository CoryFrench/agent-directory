const express = require('express');
const session = require('express-session');
const path = require('path');
const config = require('./config');
const db = require('./db');
const { getDirectoryData, getItem, createItem, updateItem, deleteItem } = require('./db');

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
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));

// Authentication middleware for pages (redirects)
function requireAuth(req, res, next) {
  console.log('Auth check - Session:', req.session);
  console.log('Auth check - Authenticated:', req.session.authenticated);
  
  if (req.session.authenticated) {
    console.log('Auth passed - proceeding');
    next();
  } else {
    console.log('Auth failed - redirecting to login');
    res.redirect('/login');
  }
}

// Authentication middleware for API calls (returns 401)
function requireAuthAPI(req, res, next) {
  console.log('API Auth check - Session:', req.session);
  console.log('API Auth check - Authenticated:', req.session.authenticated);
  console.log('API Auth check - Headers:', req.headers);
  
  if (req.session.authenticated) {
    console.log('API Auth passed - proceeding');
    next();
  } else {
    console.log('API Auth failed - returning 401');
    res.status(401).json({ error: 'Unauthorized' });
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
  console.log('Login route - Session:', req.session);
  if (req.session.authenticated) {
    res.redirect('/directory');
  } else {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
  }
});

app.post('/login', (req, res) => {
  console.log('Login attempt - Request body:', req.body);
  
  const { password } = req.body;
  
  if (password === config.directoryPassword) {
    console.log('Password verified - setting session');
    req.session.authenticated = true;
    console.log('Session after setting authenticated:', req.session);
    res.redirect('/directory');
  } else {
    console.log('Password incorrect');
    res.redirect('/login?error=1');
  }
});

// API endpoint to get agents data
app.get('/api/agents', requireAuthAPI, async (req, res) => {
  try {
    const agents = await db.getAgents();
    res.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// API endpoint to get directory data
app.get('/api/directory', requireAuthAPI, async (req, res) => {
  console.log('API /api/directory called');
  console.log('Request headers:', req.headers);
  console.log('Session in API call:', req.session);
  
  try {
    const directoryData = await db.getDirectoryData();
    console.log('Directory data fetched successfully');
    res.json(directoryData);
  } catch (error) {
    console.error('Error fetching directory data:', error);
    res.status(500).json({ error: 'Failed to fetch directory data' });
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

// Admin routes
app.get('/admin', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// CRUD operations for each type
const types = ['agents', 'affiliated', 'yacht', 'teams', 'offices', 'fax'];

types.forEach(type => {
  // Get single item
  app.get(`/api/directory/${type}/:id`, requireAuthAPI, async (req, res) => {
    try {
      const item = await getItem(type, req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(item);
    } catch (error) {
      console.error(`Error fetching ${type} item:`, error);
      res.status(500).json({ error: `Failed to fetch ${type} item` });
    }
  });

  // Create new item
  app.post(`/api/directory/${type}`, requireAuthAPI, async (req, res) => {
    try {
      const newItem = await createItem(type, req.body);
      res.status(201).json(newItem);
    } catch (error) {
      console.error(`Error creating ${type} item:`, error);
      res.status(500).json({ error: `Failed to create ${type} item` });
    }
  });

  // Update item
  app.put(`/api/directory/${type}/:id`, requireAuthAPI, async (req, res) => {
    try {
      const updatedItem = await updateItem(type, req.params.id, req.body);
      if (!updatedItem) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(updatedItem);
    } catch (error) {
      console.error(`Error updating ${type} item:`, error);
      res.status(500).json({ error: `Failed to update ${type} item` });
    }
  });

  // Delete item
  app.delete(`/api/directory/${type}/:id`, requireAuthAPI, async (req, res) => {
    try {
      const success = await deleteItem(type, req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.status(204).send();
    } catch (error) {
      console.error(`Error deleting ${type} item:`, error);
      res.status(500).json({ error: `Failed to delete ${type} item` });
    }
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Waterfront Directory server running on port ${PORT}`);
  console.log(`📂 Access at: http://localhost:${PORT}`);
  console.log(`🔐 Password: ${config.directoryPassword}`);
}); 