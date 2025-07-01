# WebMart - Pakistani Socio-Commerce Platform

A full-stack socio-commerce web application that combines social media features (like Instagram) with e-commerce capabilities, featuring authentic Pakistani context, Islamic names, and PKR currency.

## 🌟 Features

### Social Media Features
- **User Authentication**: Secure login/registration system
- **Social Feed**: Instagram-like post sharing with images
- **Like System**: Like/unlike posts with duplicate prevention
- **Real-time Chat**: Socket.io powered messaging system
- **User Profiles**: Complete user management

### E-commerce Features
- **Product Catalog**: Browse products with categories
- **Shopping Cart**: Add/remove items with persistent storage
- **Favorites**: Save favorite products
- **Search & Filter**: Advanced product filtering by category
- **Cash on Delivery**: COD payment system
- **Product Management**: Users can list their own products

### Admin Panel
- **Dashboard**: Complete statistics and analytics
- **User Management**: View, delete, and promote users to admin
- **Product Management**: Edit, delete, and manage all products
- **Content Moderation**: Manage posts and user-generated content
- **Role-based Access**: Secure admin authentication

### Pakistani Context
- **Islamic Names**: Authentic Pakistani/Islamic user names
- **PKR Currency**: All prices in Pakistani Rupees
- **Cultural Products**: Traditional items like Shalwar Kameez, Prayer Mats, etc.
- **Local Context**: Pakistani cultural references and content

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/UsmanGhias/webmart.git
   cd webmart
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Create Admin User**
   ```bash
   docker exec -it webmart-app node create_admin.js
   ```

4. **Access the application**
   - Main site: http://localhost:3001
   - Admin panel: http://localhost:3001/admin.html

### Option 2: Manual Setup

1. **Prerequisites**
   - Node.js (v14 or higher)
   - MongoDB (running on localhost:27017)
   - npm or yarn

2. **Installation**
   ```bash
   git clone https://github.com/UsmanGhias/webmart.git
   cd webmart
   npm install
   ```

3. **Database Setup**
   ```bash
   # Start MongoDB service
   sudo systemctl start mongod
   
   # Create admin user
   node create_admin.js
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the application**
   - Main site: http://localhost:3001
   - Admin panel: http://localhost:3001/admin.html

## 👤 Default Admin Credentials

After running the admin creation script:
- **Email**: admin@webmart.pk
- **Password**: admin123
- **Role**: admin

## 🏗️ Project Structure

```
webmart/
├── controllers/          # Business logic controllers
│   ├── admin.js         # Admin panel controllers
│   ├── auth.js          # Authentication controllers
│   ├── like.js          # Like system controllers
│   └── ...
├── middleware/          # Express middleware
│   ├── adminAuth.js     # Admin authentication middleware
│   ├── auth.js          # User authentication middleware
│   └── ...
├── models/              # MongoDB data models
│   ├── User.js          # User model with admin role
│   ├── Product.js       # Product model
│   ├── Post.js          # Social post model
│   └── ...
├── routes/              # API routes
│   ├── admin.js         # Admin panel routes
│   ├── api/             # API route modules
│   └── ...
├── public/              # Frontend files
│   ├── admin.html       # Admin dashboard
│   ├── index.html       # Homepage
│   ├── productfeed.html # Product catalog
│   ├── postfeed.html    # Social feed
│   ├── js/              # JavaScript files
│   └── css/             # Stylesheets
├── docker-compose.yml   # Docker configuration
├── Dockerfile           # Docker image definition
├── create_admin.js      # Admin user creation script
└── server.js            # Main server file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/web-mart
JWT_SECRET=your-super-secret-jwt-key-change-this
```

### Docker Environment

The docker-compose.yml includes:
- MongoDB with persistent storage
- Node.js application with auto-restart
- Network isolation for security
- Volume mounting for uploads

## 📱 Usage

### For Users
1. **Register/Login**: Create account or login with existing credentials
2. **Browse Products**: View products with Pakistani cultural context
3. **Social Features**: Share posts, like content, chat with others
4. **Shopping**: Add items to cart, manage favorites, place orders
5. **Profile Management**: Update profile, view order history

### For Admins
1. **Login**: Use admin credentials to access admin panel
2. **Dashboard**: View site statistics and recent activity
3. **User Management**: Manage users, promote to admin, handle violations
4. **Content Moderation**: Review and manage products and posts
5. **Analytics**: Monitor site performance and user engagement

## 🛠️ Development

### Adding New Features

1. **Backend**: Add controllers in `controllers/`, models in `models/`, routes in `routes/`
2. **Frontend**: Add HTML pages in `public/`, JavaScript in `public/js/`
3. **Admin Features**: Extend admin controllers and frontend in admin.html

### Database Schema

- **Users**: Authentication, profiles, roles (user/admin)
- **Products**: E-commerce items with Pakistani context
- **Posts**: Social media posts with likes and comments
- **Comments**: User comments on posts
- **Cart/Favorites**: User preferences and shopping data

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin vs user permissions
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **Password Hashing**: bcrypt for secure password storage

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Admin (Requires Admin Role)
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/make-admin` - Promote to admin

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Pakistani cultural context and Islamic naming conventions
- Modern web technologies (Node.js, Express, MongoDB, Socket.io)
- Beautiful UI with Tailwind CSS
- Secure authentication and admin systems

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact: admin@webmart.pk

---

**WebMart** - Connecting Pakistani communities through social commerce! 🇵🇰