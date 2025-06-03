require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  directoryPassword: process.env.DIRECTORY_PASSWORD || 'soldbywaterfront',
  sessionSecret: process.env.SESSION_SECRET || 'waterfront-directory-secret-change-in-production',
  nodeEnv: process.env.NODE_ENV || 'development'
}; 