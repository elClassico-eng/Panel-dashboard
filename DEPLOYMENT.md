# Panel Dashboard - Deployment Guide

This guide will help you deploy the Panel Dashboard application to various hosting platforms.

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Git (to clone the repository)

### Local Deployment with Docker

1. **Clone and navigate to the project:**
   ```bash
   git clone <your-repo-url>
   cd Panel-dashboard
   ```

2. **Configure environment variables:**
   ```bash
   # Copy example files
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   
   # Edit the .env files with your actual values
   ```

3. **Deploy with Docker:**
   ```bash
   ./scripts/deploy.sh
   ```

4. **Access your application:**
   - Frontend: http://localhost:3001
   - API: http://localhost:3001/api
   - MongoDB: mongodb://localhost:27017

### Manual Build and Deploy

1. **Build the application:**
   ```bash
   ./scripts/build.sh
   ```

2. **Start the server:**
   ```bash
   cd server
   npm start
   ```

## Production Deployment Options

### Option 1: VPS/Cloud Server (Recommended)

**Providers:** DigitalOcean, Linode, AWS EC2, Google Cloud Compute

1. **Set up your server:**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Deploy your application:**
   ```bash
   git clone <your-repo-url>
   cd Panel-dashboard
   
   # Update environment variables
   nano server/.env
   nano client/.env
   
   # Deploy
   ./scripts/deploy.sh
   ```

3. **Set up reverse proxy (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 2: Platform as a Service (PaaS)

#### Railway
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

#### Render
1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `./scripts/build.sh`
4. Set start command: `node server/index.js`

#### Heroku
1. Install Heroku CLI
2. Create Heroku app:
   ```bash
   heroku create your-app-name
   heroku addons:create mongolab:sandbox
   ```
3. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_ACCESS_SECRET=your-secret
   # ... other variables
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```

### Option 3: Serverless (Frontend only)

#### Vercel/Netlify (Frontend)
For frontend-only deployment, you'll need a separate backend hosting solution.

1. **Build frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

## Environment Variables

### Server (.env)
```env
# Required
DB_URL=mongodb://your-mongodb-connection-string
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
CLIENT_URL=http://localhost:5173
PRODUCTION_CLIENT_URL=https://your-production-domain.com
PORT=3001
NODE_ENV=production

# Optional (for email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Client (.env)
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_SERVER_URL=https://your-api-domain.com
```

## Database Setup

### MongoDB Atlas (Cloud - Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Create database user
4. Get connection string
5. Update `DB_URL` in server/.env

### Local MongoDB
```bash
# Install MongoDB
sudo apt-get install -y mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Use connection string
DB_URL=mongodb://localhost:27017/panel-dashboard
```

## Security Considerations

1. **Environment Variables:**
   - Never commit .env files to git
   - Use strong, unique secrets for JWT keys
   - Rotate secrets regularly

2. **CORS Configuration:**
   - Update `PRODUCTION_CLIENT_URL` in server/.env
   - Restrict CORS to your actual domains

3. **Database Security:**
   - Use MongoDB Atlas for production
   - Enable authentication
   - Use connection string with credentials

4. **HTTPS:**
   - Always use HTTPS in production
   - Configure SSL certificates (Let's Encrypt recommended)

## Monitoring and Maintenance

1. **Logs:**
   ```bash
   # Docker logs
   docker-compose logs -f
   
   # Server logs
   pm2 logs
   ```

2. **Health Checks:**
   - Set up monitoring (e.g., UptimeRobot)
   - Monitor database connections
   - Set up alerts for downtime

3. **Backups:**
   - Regular MongoDB backups
   - Code repository backups
   - Environment variable backups (securely)

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Change PORT in docker-compose.yml
   - Update client VITE_API_URL accordingly

2. **Database connection:**
   - Check DB_URL format
   - Verify network connectivity
   - Check authentication credentials

3. **CORS errors:**
   - Update PRODUCTION_CLIENT_URL
   - Check domain spelling
   - Verify HTTPS/HTTP protocol match

4. **Build failures:**
   - Check Node.js version compatibility
   - Clear node_modules and reinstall
   - Check for missing dependencies

### Getting Help

1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Check network configuration
5. Review hosting platform documentation

## Performance Optimization

1. **Frontend:**
   - Enable gzip compression
   - Use CDN for static assets
   - Implement caching strategies

2. **Backend:**
   - Use PM2 for process management
   - Implement rate limiting
   - Add database indexing

3. **Database:**
   - Use MongoDB Atlas for better performance
   - Implement proper indexing
   - Monitor query performance

---

For more detailed configuration or custom deployment scenarios, refer to the hosting provider's documentation or contact the development team.