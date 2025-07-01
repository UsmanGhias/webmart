const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/web-mart');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create users with Pakistani names
    const users = [
      {
        fullName: 'Muhammad Ahmed Khan',
        email: 'ahmed.khan@webmart.pk',
        password: 'password123',
        role: 'user'
      },
      {
        fullName: 'Fatima Zahra Sheikh',
        email: 'fatima.sheikh@webmart.pk',
        password: 'password123',
        role: 'user'
      },
      {
        fullName: 'Ali Hassan Malik',
        email: 'ali.malik@webmart.pk',
        password: 'password123',
        role: 'user'
      },
      {
        fullName: 'Ayesha Siddiqui',
        email: 'ayesha.siddiqui@webmart.pk',
        password: 'password123',
        role: 'user'
      },
      {
        fullName: 'Omar Farooq',
        email: 'omar.farooq@webmart.pk',
        password: 'password123',
        role: 'user'
      },
      {
        fullName: 'Zainab Ahmad',
        email: 'zainab.ahmad@webmart.pk',
        password: 'password123',
        role: 'user'
      },
      {
        fullName: 'Hassan Ali',
        email: 'hassan.ali@webmart.pk',
        password: 'password123',
        role: 'user'
      },
      {
        fullName: 'Mariam Khan',
        email: 'mariam.khan@webmart.pk',
        password: 'password123',
        role: 'user'
      },
      {
        fullName: 'Usman Ghias',
        email: 'usman.ghias@webmart.pk',
        password: 'password123',
        role: 'user'
      },
      {
        fullName: 'Saira Batool',
        email: 'saira.batool@webmart.pk',
        password: 'password123',
        role: 'user'
      },
      {
        fullName: 'Admin User',
        email: 'admin@webmart.pk',
        password: 'admin123',
        role: 'admin'
      }
    ];

    const createdUsers = [];
    for (let userData of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        fullName: userData.fullName,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        favorites: [],
        cart: []
      });
      
      const savedUser = await user.save();
      createdUsers.push(savedUser);
    }
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create Pakistani products with required fields
    const products = [
      {
        name: 'Shalwar Kameez - Cotton',
        desc: 'Traditional Pakistani cotton shalwar kameez with beautiful embroidery work',
        price: 3500,
        category: 'Fashion',
        quantity: 25,
        material: 'Cotton',
        media: 'https://picsum.photos/400/400?random=1',
        user: createdUsers[0]._id
      },
      {
        name: 'Prayer Mat - Velvet',
        desc: 'High quality velvet prayer mat with Islamic calligraphy',
        price: 1200,
        category: 'Religious',
        quantity: 50,
        material: 'Velvet',
        media: 'https://picsum.photos/400/400?random=2',
        user: createdUsers[1]._id
      },
      {
        name: 'Mangoes - Sindhri',
        desc: 'Fresh Sindhri mangoes from Sindh, sweet and juicy',
        price: 800,
        category: 'Food',
        quantity: 100,
        material: 'Organic',
        media: 'https://picsum.photos/400/400?random=3',
        user: createdUsers[2]._id
      },
      {
        name: 'Dupatta - Chiffon',
        desc: 'Elegant chiffon dupatta with gold border work',
        price: 1500,
        category: 'Fashion',
        quantity: 30,
        material: 'Chiffon',
        media: 'https://picsum.photos/400/400?random=4',
        user: createdUsers[3]._id
      },
      {
        name: 'Quran - Arabic/Urdu',
        desc: 'Holy Quran with Urdu translation and beautiful cover',
        price: 2000,
        category: 'Religious',
        quantity: 40,
        material: 'Paper',
        media: 'https://picsum.photos/400/400?random=5',
        user: createdUsers[4]._id
      },
      {
        name: 'Basmati Rice - 5kg',
        desc: 'Premium quality Pakistani basmati rice',
        price: 1800,
        category: 'Food',
        quantity: 75,
        material: 'Organic',
        media: 'https://picsum.photos/400/400?random=6',
        user: createdUsers[5]._id
      },
      {
        name: 'Khussas - Leather',
        desc: 'Traditional Pakistani leather khussas with mirror work',
        price: 2500,
        category: 'Fashion',
        quantity: 20,
        material: 'Leather',
        media: 'https://picsum.photos/400/400?random=7',
        user: createdUsers[6]._id
      },
      {
        name: 'Tasbeeh - Wooden',
        desc: 'Handcrafted wooden tasbeeh with 99 beads',
        price: 500,
        category: 'Religious',
        quantity: 60,
        material: 'Wood',
        media: 'https://picsum.photos/400/400?random=8',
        user: createdUsers[7]._id
      },
      {
        name: 'Chai - Green Tea',
        desc: 'Premium Pakistani green tea leaves',
        price: 600,
        category: 'Food',
        quantity: 80,
        material: 'Organic',
        media: 'https://picsum.photos/400/400?random=9',
        user: createdUsers[8]._id
      },
      {
        name: 'Kurta - Linen',
        desc: 'Comfortable linen kurta for men with collar design',
        price: 2200,
        category: 'Fashion',
        quantity: 35,
        material: 'Linen',
        media: 'https://picsum.photos/400/400?random=10',
        user: createdUsers[9]._id
      },
      {
        name: 'Wall Clock - Islamic',
        desc: 'Beautiful wall clock with Islamic calligraphy',
        price: 1800,
        category: 'Home',
        quantity: 15,
        material: 'Wood',
        media: 'https://picsum.photos/400/400?random=11',
        user: createdUsers[0]._id
      },
      {
        name: 'Dates - Khajoor',
        desc: 'Premium quality dates from Saudi Arabia',
        price: 1200,
        category: 'Food',
        quantity: 90,
        material: 'Organic',
        media: 'https://picsum.photos/400/400?random=12',
        user: createdUsers[1]._id
      },
      {
        name: 'Shawl - Pashmina',
        desc: 'Warm pashmina shawl from Kashmir',
        price: 4500,
        category: 'Fashion',
        quantity: 12,
        material: 'Pashmina',
        media: 'https://picsum.photos/400/400?random=13',
        user: createdUsers[2]._id
      },
      {
        name: 'Henna Powder',
        desc: 'Natural henna powder for beautiful designs',
        price: 300,
        category: 'Beauty',
        quantity: 100,
        material: 'Natural',
        media: 'https://picsum.photos/400/400?random=14',
        user: createdUsers[3]._id
      },
      {
        name: 'Pakistani Flag',
        desc: 'High quality Pakistani flag with proper dimensions',
        price: 400,
        category: 'Home',
        quantity: 50,
        material: 'Fabric',
        media: 'https://picsum.photos/400/400?random=15',
        user: createdUsers[4]._id
      }
    ];

    const createdProducts = [];
    for (let productData of products) {
      const product = new Product(productData);
      const savedProduct = await product.save();
      createdProducts.push(savedProduct);
    }
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create posts with Pakistani cultural context
    const posts = [
      {
        desc: 'Celebrating Eid with family! May Allah bless us all. #EidMubarak #Pakistan',
        media: 'https://picsum.photos/400/400?random=101',
        user: createdUsers[0]._id,
        likes: [createdUsers[1]._id, createdUsers[2]._id],
        comments: []
      },
      {
        desc: 'Just received fresh mangoes from our farm in Multan! The taste of summer 🥭 #Mangoes #Pakistan',
        media: 'https://picsum.photos/400/400?random=102',
        user: createdUsers[2]._id,
        likes: [createdUsers[0]._id, createdUsers[3]._id, createdUsers[4]._id],
        comments: []
      },
      {
        desc: 'Beautiful sunset view from Badshahi Mosque, Lahore. SubhanAllah! #Lahore #Pakistan #Mosque',
        media: 'https://picsum.photos/400/400?random=103',
        user: createdUsers[1]._id,
        likes: [createdUsers[0]._id, createdUsers[5]._id],
        comments: []
      },
      {
        desc: 'Starting my small business selling traditional Pakistani dresses. Prayers needed! 🤲 #SmallBusiness #Pakistan',
        media: 'https://picsum.photos/400/400?random=104',
        user: createdUsers[3]._id,
        likes: [createdUsers[1]._id, createdUsers[6]._id, createdUsers[7]._id],
        comments: []
      },
      {
        desc: 'Cricket match tonight! Pakistan Zindabad! 🏏 #Cricket #Pakistan #PakistanZindabad',
        media: 'https://picsum.photos/400/400?random=105',
        user: createdUsers[4]._id,
        likes: [createdUsers[2]._id, createdUsers[8]._id],
        comments: []
      },
      {
        desc: 'Iftar preparation in full swing. Ramadan Kareem to all! #Ramadan #Iftar #Pakistan',
        media: 'https://picsum.photos/400/400?random=106',
        user: createdUsers[5]._id,
        likes: [createdUsers[3]._id, createdUsers[9]._id, createdUsers[0]._id],
        comments: []
      },
      {
        desc: 'Visited the beautiful Shalimar Gardens in Lahore today. Pakistan ki shaan! 🌹 #ShalmarGardens #Lahore',
        media: 'https://picsum.photos/400/400?random=107',
        user: createdUsers[6]._id,
        likes: [createdUsers[4]._id, createdUsers[1]._id],
        comments: []
      },
      {
        desc: 'Learning Quran recitation. May Allah make it easy for all of us. Ameen! #Quran #Learning #Islam',
        media: 'https://picsum.photos/400/400?random=108',
        user: createdUsers[7]._id,
        likes: [createdUsers[5]._id, createdUsers[8]._id, createdUsers[9]._id],
        comments: []
      }
    ];

    const createdPosts = [];
    for (let postData of posts) {
      const post = new Post(postData);
      const savedPost = await post.save();
      createdPosts.push(savedPost);
    }
    console.log(`✅ Created ${createdPosts.length} posts`);

    // Create some comments
    const comments = [
      {
        text: 'Eid Mubarak to you too! May Allah bless your family.',
        user: createdUsers[1]._id,
        post: createdPosts[0]._id
      },
      {
        text: 'MashaAllah! Those mangoes look delicious.',
        user: createdUsers[0]._id,
        post: createdPosts[1]._id
      },
      {
        text: 'Beautiful picture! Lahore is amazing.',
        user: createdUsers[3]._id,
        post: createdPosts[2]._id
      },
      {
        text: 'Best of luck with your business! May Allah give you success.',
        user: createdUsers[2]._id,
        post: createdPosts[3]._id
      },
      {
        text: 'Pakistan will win InshAllah! 🏏',
        user: createdUsers[5]._id,
        post: createdPosts[4]._id
      },
      {
        text: 'Ramadan Kareem! Your iftar looks delicious.',
        user: createdUsers[4]._id,
        post: createdPosts[5]._id
      },
      {
        text: 'Shalimar Gardens are truly beautiful. Great shot!',
        user: createdUsers[7]._id,
        post: createdPosts[6]._id
      }
    ];

    const createdComments = [];
    for (let commentData of comments) {
      const comment = new Comment(commentData);
      const savedComment = await comment.save();
      createdComments.push(savedComment);
      
      // Add comment to post
      await Post.findByIdAndUpdate(
        commentData.post,
        { $push: { comments: savedComment._id } }
      );
    }
    console.log(`✅ Created ${createdComments.length} comments`);

    console.log('\n🎉 Database seeded successfully with Pakistani context!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${createdUsers.length} (including 1 admin)`);
    console.log(`📦 Products: ${createdProducts.length} (traditional Pakistani items)`);
    console.log(`📝 Posts: ${createdPosts.length} (Pakistani cultural content)`);
    console.log(`💬 Comments: ${createdComments.length}`);
    console.log('\n🔑 Admin Login:');
    console.log('Email: admin@webmart.pk');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedData(); 