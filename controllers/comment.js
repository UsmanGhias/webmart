const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const User = require("../models/User");

exports.addComment = async (req, res) => {
    const { postId, content } = req.body;
    const userId = req.user.id;

    try {
      const userData = await User.findById(userId);
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      const comment = await Comment.create({
        user: userId,
        post: postId,
        text: content
      });

      post.comments.unshift(comment);
      await post.save();

      // Create a new notification
      const notification = new Notification({
        user: post.user,
        post: post._id,
        type: "commented",
        sourceUser: userId,
      });
      await notification.save();

      // populate the 'user' field of the new comment with the username
      const ans = await Post.find({_id: postId}).populate({
        model: 'Comment', path: 'comments',
        populate: {path: 'user', model: 'User', select: 'name -_id'}
      });

      res.json(ans);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send('Server Error');
    }
  };

  exports.deleteComment = async (req, res) => {
    try {
      const { postId, commentId } = req.body;

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      const comment = post.comments.find(
        (comment) => comment._id.toString() === commentId
      );

      if (!comment) {
        return res.status(404).json({ msg: "Comment not found" });
      }

      // Check if the user is the owner of the comment
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }

      // Remove the comment from the post
      post.comments = post.comments.filter(
        (comment) => comment._id.toString() !== commentId
      );

      await post.save();

      return res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  };
