// MongoDB initialization script for WebMart Pakistani Socio-Commerce Platform
db = db.getSiblingDB('web-mart');

// Create collections
db.createCollection('users');
db.createCollection('products');
db.createCollection('posts');
db.createCollection('comments');
db.createCollection('conversations');
db.createCollection('messages');
db.createCollection('orders');
db.createCollection('businesses');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.products.createIndex({ category: 1 });
db.products.createIndex({ user: 1 });
db.posts.createIndex({ user: 1 });
db.posts.createIndex({ createdAt: -1 });
db.comments.createIndex({ post: 1 });

print('WebMart database initialized successfully!');
print('Run seed_comprehensive.js to populate with Pakistani sample data.');
print('Admin access: admin@webmart.pk / admin123'); 