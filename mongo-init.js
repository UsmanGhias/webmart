// MongoDB initialization script for Docker
db = db.getSiblingDB('web-mart');

// Create collections
db.createCollection('users');
db.createCollection('products');
db.createCollection('posts');
db.createCollection('comments');

print('Database initialized successfully!'); 