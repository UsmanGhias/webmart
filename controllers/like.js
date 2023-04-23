const Post = require("../models/Post");
const Notification = require("../models/Notification");

// Like a post
exports.likePost = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check if the post has already been liked by the user
    if (
      post.likes.filter((like) => like.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift(req.user.id);

    await post.save();

    // Create a new notification
    const notification = new Notification({
      user: post.user,
      post: post._id,
      type: "liked",
      sourceUser: userId,
    });
    await notification.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};



// Unlike a post
// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.body.postId);
    if (!post) return res.status(404).send('The post with the given ID was not found.');

    // Check if the post has already been liked by the user
    if (!post.likes.includes(req.user.id)) return res.status(400).send('Post has not yet been liked');

    // Remove the user's id from the likes array
    post.likes = post.likes.filter(id => id.toString() !== req.user.id.toString());
    await post.save();

    return res.json(post);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Server Error');
  }
};
