const Post = require("../models/Post");

// Like a post
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    // Remove any existing duplicates first
    post.likes = post.likes.filter((id, index, self) => 
      self.findIndex(otherId => otherId.toString() === id.toString()) === index
    );

    // Debug logging
    console.log("LIKE: userId from token:", userId);
    console.log("LIKE: post.likes:", post.likes.map(id => id.toString()));
    console.log("LIKE: postId from body:", postId);

    // Check if user has already liked this post
    const alreadyLiked = post.likes.map(id => id.toString()).includes(userId.toString());
    
    if (alreadyLiked) {
      return res.status(400).json({ msg: "Post already liked by this user" });
    }

    post.likes.unshift(userId);
    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    // Remove any existing duplicates first
    post.likes = post.likes.filter((id, index, self) => 
      self.findIndex(otherId => otherId.toString() === id.toString()) === index
    );

    // Debug logging
    console.log("UNLIKE: userId from token:", userId);
    console.log("UNLIKE: post.likes:", post.likes.map(id => id.toString()));
    console.log("UNLIKE: postId from params:", postId);

    if (!post.likes.map(id => id.toString()).includes(userId.toString())) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }
    
    // Remove all instances of this user ID (in case there are duplicates)
    post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    await post.save();

    return res.json(post.likes);
  } catch (error) {
    console.error("Unlike Error:", error.message);
    return res.status(500).send('Server Error');
  }
};
