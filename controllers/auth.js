const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    user = new User({
      fullName: fullName,
      email: email,
      password: password,
      profilePic: "",
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();


    const payload = {
      user: {
        id: user.id,
      },
    };

    const userData = {
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      isSeller: user.isSeller,
      id: user._id
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "168h" },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          userData, 
          user: userData,
          token 
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT secret not set');
    }

    const userData = {
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      isSeller: user.isSeller,
      id: user._id
    }

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '168h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          userData, 
          user: userData,
          token 
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
