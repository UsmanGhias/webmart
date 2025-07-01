# 🚀 WebMart Deployment Guide

## 📋 Quick Setup Summary

Your **Pakistani Socio-Commerce Platform** is now complete with:
- ✅ Admin Panel with full management capabilities
- ✅ Pakistani cultural context (Islamic names, PKR currency)
- ✅ Docker support for easy deployment
- ✅ Complete social media + e-commerce features
- ✅ Security with JWT authentication and role-based access

## 🐳 Docker Deployment (Recommended)

### 1. Clone and Start
```bash
git clone https://github.com/UsmanGhias/webmart.git
cd webmart
docker-compose up -d
```

### 2. Create Admin User
```bash
docker exec -it webmart-app node create_admin.js
```

### 3. Access Your Application
- **Main Site**: http://localhost:3001
- **Admin Panel**: http://localhost:3001/admin.html
- **Admin Login**: admin@webmart.pk / admin123

## 🔧 Manual Deployment

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm/yarn

### Setup Steps
```bash
# 1. Clone repository
git clone https://github.com/UsmanGhias/webmart.git
cd webmart

# 2. Install dependencies
npm install

# 3. Start MongoDB
sudo systemctl start mongod

# 4. Create admin user
node create_admin.js

# 5. Start application
npm start
```

## 👤 Default Admin Credentials

**Email**: admin@webmart.pk  
**Password**: admin123  
**Role**: admin

## 🌟 Features Overview

### For Regular Users
- **Social Feed**: Share posts, like content, chat with others
- **Product Catalog**: Browse Pakistani products with categories
- **Shopping Cart**: Add items, manage favorites
- **Search & Filter**: Find products by category/name
- **User Profile**: Manage account and preferences

### For Admin Users
- **Dashboard**: View site statistics and analytics
- **User Management**: View, delete, promote users to admin
- **Product Management**: Edit, delete, manage all products
- **Content Moderation**: Manage posts and user content
- **Role Management**: Assign admin privileges

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Role-based Access**: Admin vs user permissions
- **Password Hashing**: bcrypt for secure storage
- **Input Validation**: Server-side validation
- **CORS Protection**: Secure cross-origin requests

## 📊 Database Schema

### Users Collection
```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  favorites: [ObjectId],
  cart: [ObjectId],
  createdAt: Date
}
```

### Products Collection
```javascript
{
  name: String,
  desc: String,
  price: Number,
  category: String,
  quantity: Number,
  user: ObjectId,
  createdAt: Date
}
```

### Posts Collection
```javascript
{
  desc: String,
  user: ObjectId,
  likes: [ObjectId],
  comments: [ObjectId],
  createdAt: Date
}
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Admin (Requires Admin Role)
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/make-admin` - Promote to admin
- `GET /api/admin/products` - Get all products
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/posts` - Get all posts
- `DELETE /api/admin/posts/:id` - Delete post

## 📱 Pakistani Context Features

### Cultural Elements
- **Islamic Names**: Muhammad Ahmed Khan, Fatima Zahra Sheikh, etc.
- **PKR Currency**: All prices in Pakistani Rupees
- **Traditional Products**: Shalwar Kameez, Prayer Mats, Mangoes, etc.
- **Local Context**: Pakistani cultural references

### Sample Data Included
- **10 Users** with authentic Pakistani names
- **15 Products** featuring traditional Pakistani items
- **8 Social Posts** with Pakistani cultural content
- **Email Domains**: @webmart.pk for local context

## 🐳 Docker Configuration

### Services
- **MongoDB**: Persistent database with authentication
- **Node.js App**: Main application with auto-restart
- **Networking**: Isolated network for security
- **Volumes**: Persistent data and uploads

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb://mongodb:27017/web-mart
JWT_SECRET=your-super-secret-jwt-key-change-this
```

## 🔄 Production Deployment

### For VPS/Server Deployment
1. **Setup Domain**: Point your domain to server IP
2. **SSL Certificate**: Use Let's Encrypt for HTTPS
3. **Reverse Proxy**: Configure Nginx for production
4. **Environment**: Set production environment variables
5. **Process Manager**: Use PM2 for process management

### For Cloud Deployment (AWS/Digital Ocean)
1. **Container Registry**: Push Docker image to registry
2. **Container Service**: Deploy using ECS/Kubernetes
3. **Database**: Use managed MongoDB service
4. **Load Balancer**: Configure for high availability
5. **CDN**: Use CloudFront for static assets

## 📈 Monitoring & Maintenance

### Health Checks
- Application status: `GET /hello`
- Database connectivity: Monitor MongoDB logs
- Admin access: Regular admin panel checks

### Backup Strategy
- **Database**: Regular MongoDB backups
- **Uploads**: Backup user uploaded files
- **Code**: Version control with Git

## 🆘 Troubleshooting

### Common Issues
1. **Port 3001 in use**: `pkill -f "node server.js"`
2. **MongoDB connection**: Check MongoDB service status
3. **Admin access denied**: Verify admin user exists
4. **Docker issues**: Check container logs

### Logs Location
- Application logs: Console output
- MongoDB logs: `/var/log/mongodb/`
- Docker logs: `docker logs webmart-app`

## 📞 Support

For issues or questions:
- **GitHub Issues**: Create issue on repository
- **Email**: admin@webmart.pk
- **Documentation**: Check README.md

---

**🎉 Your Pakistani Socio-Commerce Platform is Ready!**

Access your admin panel at: http://localhost:3001/admin.html  
Login with: admin@webmart.pk / admin123 