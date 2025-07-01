# WebMart - Pakistani Socio-Commerce Platform 🇵🇰

A full-stack socio-commerce web application combining social media features (like Instagram) with e-commerce capabilities, designed specifically for the Pakistani market with authentic cultural context.

## 🌟 Features

### 🛒 E-Commerce Features
- **Product Catalog**: Browse traditional Pakistani products (Shalwar Kameez, Prayer Mats, Mangoes, etc.)
- **Shopping Cart**: Add/remove items with real-time updates
- **Favorites**: Save favorite products for later
- **Categories**: Filter by Fashion, Religious, Food, Beauty, Home
- **Search**: Find products by name or description
- **Cash on Delivery**: Traditional Pakistani payment method

### 📱 Social Media Features
- **Social Feed**: Instagram-like post sharing with Pakistani cultural content
- **Like System**: Like/unlike posts (duplicate prevention)
- **Comments**: Engage with community posts
- **User Profiles**: Pakistani names and @webmart.pk emails
- **Real-time Chat**: Socket.io powered messaging

### 🔧 Admin Panel
- **Dashboard**: Statistics overview (users, products, posts, comments)
- **User Management**: View, delete, promote users to admin
- **Product Management**: View, edit, delete products
- **Post Management**: Content moderation and management
- **Role-based Access**: Secure admin authentication

### 🇵🇰 Pakistani Context
- **Islamic Names**: Muhammad Ahmed Khan, Fatima Zahra Sheikh, etc.
- **PKR Currency**: All prices in Pakistani Rupees
- **Cultural Products**: Traditional Pakistani items and clothing
- **Local Content**: Posts about Eid, Ramadan, Cricket, Pakistani cities
- **Email Domain**: @webmart.pk for all users

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 6.0+
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/UsmanGhias/webmart.git
cd webmart
```

2. **Install dependencies**
```bash
npm install
```

3. **Start MongoDB**
```bash
# Make sure MongoDB is running on localhost:27017
sudo systemctl start mongod
```

4. **Seed the database**
```bash
node seed_comprehensive.js
```

5. **Start the server**
```bash
npm start
```

6. **Access the application**
- Main App: http://localhost:3001
- Admin Panel: http://localhost:3001/admin.html

### Docker Deployment

1. **Build and run with Docker Compose**
```bash
docker-compose up -d
```

2. **Seed the database (in Docker)**
```bash
docker-compose exec app node seed_comprehensive.js
```

3. **Access the application**
- Main App: http://localhost:3001
- Admin Panel: http://localhost:3001/admin.html

## 👥 Default Users

### Admin User
- **Email**: admin@webmart.pk
- **Password**: admin123
- **Role**: admin

### Sample Users
- **Muhammad Ahmed Khan**: ahmed.khan@webmart.pk
- **Fatima Zahra Sheikh**: fatima.sheikh@webmart.pk
- **Ali Hassan Malik**: ali.malik@webmart.pk
- **Password for all**: password123

## 📦 Sample Data

### Products (15 items)
- Shalwar Kameez - Cotton (PKR 3,500)
- Prayer Mat - Velvet (PKR 1,200)
- Mangoes - Sindhri (PKR 800)
- Dupatta - Chiffon (PKR 1,500)
- Quran - Arabic/Urdu (PKR 2,000)
- And 10 more traditional Pakistani items...

### Posts (8 cultural posts)
- Eid celebrations
- Fresh mangoes from Multan
- Badshahi Mosque sunset
- Small business startup
- Cricket match excitement
- Ramadan iftar preparation
- Shalimar Gardens visit
- Quran learning journey

## 🛠 Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Socket.io** for real-time chat
- **Multer** for file uploads
- **bcryptjs** for password hashing

### Frontend
- **HTML5** with semantic structure
- **CSS3** with responsive design
- **Vanilla JavaScript** with modern ES6+
- **Tailwind CSS** for admin panel
- **Font Awesome** icons

### DevOps
- **Docker** containerization
- **Docker Compose** multi-service setup
- **MongoDB** database with indexes
- **Environment** configuration

## 📁 Project Structure

```
webmart/
├── controllers/          # Business logic
│   ├── auth.js          # Authentication
│   ├── admin.js         # Admin operations
│   ├── product.js       # Product management
│   ├── post.js          # Social posts
│   └── like.js          # Like system
├── middleware/          # Custom middleware
│   ├── verifyToken.js   # JWT verification
│   └── adminAuth.js     # Admin authentication
├── models/              # Database schemas
│   ├── User.js          # User model
│   ├── Product.js       # Product model
│   ├── Post.js          # Post model
│   └── Comment.js       # Comment model
├── routes/              # API routes
│   ├── admin.js         # Admin routes
│   └── api/             # API endpoints
├── public/              # Static files
│   ├── index.html       # Homepage
│   ├── admin.html       # Admin panel
│   ├── css/             # Stylesheets
│   └── js/              # Client-side scripts
├── docker-compose.yml   # Docker services
├── Dockerfile           # Container config
└── seed_comprehensive.js # Sample data
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Role-based Access**: Admin vs user permissions
- **Input Validation**: Server-side validation
- **CORS Protection**: Cross-origin request handling
- **File Upload Security**: Multer with file type validation

## 🧪 Testing

Run the comprehensive test suite:

```bash
node final_admin_test.js
```

Test results include:
- ✅ Admin authentication
- ✅ Database statistics
- ✅ Pakistani context verification
- ✅ Like system integrity
- ✅ Admin routes verification
- ✅ User roles distribution
- ✅ Sample data quality

## 🚀 Deployment

### Production Environment Variables

```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
MONGO_URI=mongodb://localhost:27017/web-mart
PORT=3001
```

### Docker Production

```bash
# Build for production
docker-compose -f docker-compose.yml up -d

# Scale the application
docker-compose up -d --scale app=3
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Pakistani cultural context and Islamic names
- Traditional Pakistani products and cuisine
- Socket.io for real-time features
- MongoDB for flexible data storage
- Express.js for robust backend
- Tailwind CSS for modern UI

## 📞 Support

For support, email support@webmart.pk or create an issue on GitHub.

---

**Made with ❤️ for Pakistan** 🇵🇰