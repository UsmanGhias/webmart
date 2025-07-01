const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/web-mart');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@webmart.pk', role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@webmart.pk');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = new User({
      fullName: 'Admin User',
      email: 'admin@webmart.pk',
      password: hashedPassword,
      role: 'admin',
      favorites: [],
      cart: []
    });

    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@webmart.pk');
    console.log('🔒 Password: admin123');
    console.log('🔑 Role: admin');
    console.log('\nYou can now login with these credentials to access admin features.');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

createAdmin(); 