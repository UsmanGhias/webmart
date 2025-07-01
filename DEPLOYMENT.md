# 🚀 WebMart Deployment Guide

Complete deployment instructions for the Pakistani Socio-Commerce Platform.

## 📋 Prerequisites

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Git** for cloning
- **4GB RAM** minimum
- **10GB Storage** minimum

## 🔧 Quick Deployment (Docker - Recommended)

### 1. Clone Repository
```bash
git clone https://github.com/UsmanGhias/webmart.git
cd webmart
```

### 2. Deploy with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps
```

### 3. Initialize Database
```bash
# Seed with Pakistani sample data
docker-compose exec app node seed_comprehensive.js
```

### 4. Access Application
- **Main Platform**: http://localhost:3001
- **Admin Panel**: http://localhost:3001/admin.html

## 👥 Default Login Credentials

### Admin Access
- **URL**: http://localhost:3001/admin.html
- **Email**: admin@webmart.pk
- **Password**: admin123

### Sample Users
- **Muhammad Ahmed Khan**: ahmed.khan@webmart.pk / password123
- **Fatima Zahra Sheikh**: fatima.sheikh@webmart.pk / password123
- **Ali Hassan Malik**: ali.malik@webmart.pk / password123

## 🛠 Manual Deployment (Development)

### 1. Prerequisites
```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB 6.0+
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

### 2. Setup Application
```bash
# Clone and install
git clone https://github.com/UsmanGhias/webmart.git
cd webmart
npm install

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Seed database
node seed_comprehensive.js

# Start application
npm start
```

## 🌐 Production Deployment

### Environment Variables
Create `.env` file:
```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this
MONGO_URI=mongodb://localhost:27017/web-mart
PORT=3001
```

### Docker Production
```bash
# Build production image
docker build -t webmart:latest .

# Run with production config
docker run -d \
  --name webmart-app \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret-key \
  -e MONGO_URI=mongodb://mongo:27017/web-mart \
  webmart:latest
```

### Nginx Reverse Proxy
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## �� Verification Steps

### 1. Health Check
```bash
# Check application status
curl http://localhost:3001/api/health

# Check database connection
docker-compose exec app node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://mongo:27017/web-mart')
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.log('❌ Database error:', err.message));
"
```

### 2. Feature Testing
```bash
# Test admin authentication
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@webmart.pk","password":"admin123"}'

# Test product API
curl http://localhost:3001/api/products

# Test posts API
curl http://localhost:3001/api/posts/all
```

### 3. Database Verification
```bash
# Connect to MongoDB and check data
docker-compose exec mongo mongosh web-mart --eval "
db.users.countDocuments();
db.products.countDocuments();
db.posts.countDocuments();
"
```

## 📊 Monitoring

### Docker Logs
```bash
# View application logs
docker-compose logs -f app

# View MongoDB logs
docker-compose logs -f mongo

# View all services
docker-compose logs -f
```

### Resource Usage
```bash
# Check container resources
docker stats

# Check disk usage
docker system df
```

## 🔧 Maintenance

### Backup Database
```bash
# Create backup
docker-compose exec mongo mongodump --db web-mart --out /tmp/backup

# Copy backup to host
docker cp $(docker-compose ps -q mongo):/tmp/backup ./backup
```

### Update Application
```bash
# Pull latest changes
git pull origin master

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Scale Services
```bash
# Scale application instances
docker-compose up -d --scale app=3

# Use load balancer for multiple instances
```

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process using port 3001
sudo lsof -ti:3001 | xargs kill -9

# Or change port in docker-compose.yml
ports:
  - "3002:3001"  # Host:Container
```

#### MongoDB Connection Error
```bash
# Check MongoDB status
docker-compose exec mongo mongosh --eval "db.adminCommand('ismaster')"

# Restart MongoDB
docker-compose restart mongo
```

#### Admin Panel Access Denied
```bash
# Recreate admin user
docker-compose exec app node -e "
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://mongo:27017/web-mart').then(async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);
  
  await User.findOneAndUpdate(
    { email: 'admin@webmart.pk' },
    { role: 'admin', password: hashedPassword },
    { upsert: true }
  );
  
  console.log('✅ Admin user fixed');
  process.exit(0);
});
"
```

### Performance Optimization

#### Database Indexes
```bash
# Add performance indexes
docker-compose exec mongo mongosh web-mart --eval "
db.users.createIndex({ email: 1 }, { unique: true });
db.products.createIndex({ category: 1 });
db.posts.createIndex({ createdAt: -1 });
"
```

#### Memory Optimization
```yaml
# In docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

## 📈 Scaling

### Horizontal Scaling
```bash
# Multiple app instances
docker-compose up -d --scale app=3

# Add load balancer (nginx/traefik)
```

### Database Scaling
```bash
# MongoDB replica set
# Add to docker-compose.yml:
mongo-secondary:
  image: mongo:6.0
  command: mongod --replSet rs0
```

## 🔐 Security Checklist

- [ ] Change default JWT secret
- [ ] Update admin password
- [ ] Enable MongoDB authentication
- [ ] Setup SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Monitor access logs

## 📞 Support

For deployment issues:
- **GitHub Issues**: https://github.com/UsmanGhias/webmart/issues
- **Email**: support@webmart.pk
- **Documentation**: Check README.md

---

**WebMart Pakistani Socio-Commerce Platform** 🇵🇰
*Ready for production deployment with Pakistani cultural context* 