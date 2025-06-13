require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  directoryPassword: process.env.DIRECTORY_PASSWORD || 'default_password',
  sessionSecret: process.env.SESSION_SECRET || 'your-secret-key',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'microservices',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  },
  nodeEnv: process.env.NODE_ENV || 'development'
}; 