const Post = require("../models/Post");

// Like a post
exports.likePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.body.postId;
    
    console.log('LIKE: userId from token:', userId);
    console.log('LIKE: postId from body:', postId);
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    console.log('LIKE: post.likes before:', post.likes);
    
    // Check if user already liked the post
    const alreadyLiked = post.likes.some(like => like.toString() === userId);
    
    if (alreadyLiked) {
      return res.status(400).json({ msg: 'Post already liked by this user' });
    }
    
    // Add like
    post.likes.push(userId);
    await post.save();
    
    console.log('LIKE: post.likes after:', post.likes);
    
    res.json({ msg: 'Post liked successfully', likes: post.likes.length });
  } catch (error) {
    console.error('Like post error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    
    console.log('UNLIKE: userId from token:', userId);
    console.log('UNLIKE: postId from params:', postId);
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    console.log('UNLIKE: post.likes before:', post.likes);
    
    // Remove all instances of this user's like (to handle duplicates)
    post.likes = post.likes.filter(like => like.toString() !== userId);
    await post.save();
    
    console.log('UNLIKE: post.likes after:', post.likes);
    
    res.json({ msg: 'Post unliked successfully', likes: post.likes.length });
  } catch (error) {
    console.error('Unlike post error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Clean up duplicate likes for all posts
exports.cleanupDuplicateLikes = async (req, res) => {
  try {
    const posts = await Post.find();
    let cleanedCount = 0;
    
    for (let post of posts) {
      const originalLength = post.likes.length;
      // Remove duplicates by converting to Set and back to array
      const uniqueLikes = [...new Set(post.likes.map(like => like.toString()))];
      
      if (uniqueLikes.length !== originalLength) {
        post.likes = uniqueLikes;
        await post.save();
        cleanedCount++;
      }
    }
    
    res.json({ 
      msg: `Cleaned up duplicate likes from ${cleanedCount} posts`,
      totalPosts: posts.length,
      cleanedPosts: cleanedCount
    });
  } catch (error) {
    console.error('Cleanup error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
