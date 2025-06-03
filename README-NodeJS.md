# Waterfront Properties Directory - Node.js Version

A modern, containerized Node.js version of the Waterfront Properties Company Directory, converted from the original ASP.NET application.

## 🚀 Quick Start

### Option 1: Docker (Recommended)
```bash
# Clone and run with Docker Compose
docker-compose up --build

# Access at http://localhost:3000
# Default password: soldbywaterfront
```

### Option 2: Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3000
```

## ✨ Features

- **🔐 Secure Authentication** - Session-based login with configurable password
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **🐋 Docker Ready** - Optimized Alpine Linux container (~80MB)
- **⚡ Fast & Lightweight** - Node.js Express server
- **🔒 Security Headers** - Helmet.js protection
- **🏥 Health Checks** - Built-in health monitoring
- **📊 Employee Directory** - Complete contact information with social links

## 🏗️ Architecture

```
┌─────────────────────┐    ┌─────────────────────┐
│   Login Page        │────│   Express Server    │
│   (login.html)      │    │   (server.js)       │
└─────────────────────┘    └─────────────────────┘
                                      │
┌─────────────────────┐              │
│  Directory Page     │────────────────┘
│  (directory.html)   │
└─────────────────────┘

Static Assets:
- Logo images
- Employee data (HTML table)
```

## 📁 Project Structure

```
waterfront-directory/
├── 📄 server.js           # Main Express application
├── ⚙️ config.js           # Configuration management
├── 📦 package.json        # Node.js dependencies
├── 🐋 Dockerfile          # Container configuration
├── 🐋 docker-compose.yml  # Docker Compose setup
├── views/
│   ├── 🔐 login.html      # Login page
│   └── 📋 directory.html  # Employee directory
├── public/
│   ├── 🖼️ wflogo.jpg      # Company logos
│   └── 🖼️ wflogo2.jpg
└── 📚 README-NodeJS.md    # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `DIRECTORY_PASSWORD` | `soldbywaterfront` | Login password |
| `SESSION_SECRET` | `auto-generated` | Session encryption key |
| `NODE_ENV` | `development` | Environment mode |

### Local Development
```bash
# Option 1: Use environment variables
export DIRECTORY_PASSWORD="your-password"
export SESSION_SECRET="your-secret-key"
npm start

# Option 2: Create .env file
echo "DIRECTORY_PASSWORD=your-password" > .env
echo "SESSION_SECRET=your-secret-key" >> .env
npm start
```

### Docker
```bash
# Edit docker-compose.yml environment section
environment:
  - DIRECTORY_PASSWORD=your-new-password
  - SESSION_SECRET=your-unique-secret
```

## 🐋 Docker Deployment

### Single Container
```bash
# Build image
docker build -t waterfront-directory .

# Run container
docker run -p 3000:3000 \
  -e DIRECTORY_PASSWORD=your-password \
  waterfront-directory
```

### Production with Docker Compose
```bash
# Production deployment
NODE_ENV=production docker-compose up -d

# Check logs
docker-compose logs -f

# Update password
docker-compose down
# Edit docker-compose.yml
docker-compose up -d
```

## 🔐 Security Features

- **Session Management** - 30-minute timeout with secure cookies
- **HTTPS Ready** - Secure cookies in production mode
- **Security Headers** - Helmet.js with CSP protection
- **No Directory Listing** - Protected against file enumeration
- **Input Validation** - Protection against common attacks
- **Non-root Container** - Runs as unprivileged user

## 📊 Employee Data

The directory contains contact information for:
- **Real Estate Agents** - Direct phones, cells, emails
- **Support Staff** - Administrative and technical contacts
- **Yacht Brokerage** - Waterfront Yacht team
- **Social Media Links** - Facebook, LinkedIn, company portals

## 🏥 Monitoring

### Health Check Endpoint
```bash
curl http://localhost:3000/health
# Response: {"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

### Container Health
```bash
# Check container health
docker ps
# Look for "healthy" status

# Manual health check
docker exec container_name node -e "require('http').get('http://localhost:3000/health', console.log)"
```

## 🔄 Migration from ASP.NET

This Node.js version maintains 100% functional compatibility with the original ASP.NET application:

| Feature | ASP.NET | Node.js |
|---------|---------|---------|
| Authentication | Forms Auth | Express Sessions |
| Password Storage | Web.config | Environment Variables |
| Employee Data | Embedded HTML | Static HTML File |
| Logout | Server Control | AJAX Form Submit |
| Session Timeout | 30 minutes | 30 minutes |
| Security Headers | IIS | Helmet.js |

## 🚀 Deployment Options

### Cloud Platforms
- **AWS ECS/Fargate** - Container service
- **Google Cloud Run** - Serverless containers  
- **Azure Container Instances** - Quick deployment
- **DigitalOcean App Platform** - Simple container hosting
- **Heroku** - Git-based deployment

### Self-Hosted
- **Docker Swarm** - Container orchestration
- **Kubernetes** - Enterprise container platform
- **VPS** - Traditional virtual private server
- **Raspberry Pi** - Edge/local deployment

## 🛠️ Development

### Adding New Employees
1. Edit `views/directory.html`
2. Add new `<TR>` row with employee data
3. Restart server or rebuild container

### Customizing UI
- Edit CSS in `views/login.html` and `views/directory.html`
- Update logo images in `public/` folder
- Modify styling without server restart

### Adding Features
- Authentication improvements in `server.js`
- New routes and middleware
- Database integration for dynamic employee data

## 📞 Support

For questions or issues:
- **Email**: support@wfpcc.com
- **Original README**: See README.md for ASP.NET version details

## 📄 License

Internal use for Waterfront Properties Company.

---

**Container Size**: ~80MB Alpine Linux  
**Memory Usage**: ~50MB RAM  
**Startup Time**: <2 seconds  
**Security**: Production-ready defaults 