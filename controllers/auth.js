// controllers/auth.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.registerUser = async (req, res) => {
  try {
    console.log("Signup API called")
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    user = new User({
      name: name,
      email: email,
      password: password,
      gender: "None",
      phoneNumber: "",
      website: "",
      profilePic: "",
      bio: "",
    });
    // console.log("User has been created")

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // console.log("Password hash has been generated: ", user.password)

    await user.save();

    // console.log("User has been saved in DB")

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "168h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
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
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      id: user._id
    }

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '168h' },
      (err, token) => {
        if (err) throw err;
        res.json({ userData, token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
