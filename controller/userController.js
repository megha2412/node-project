const User = require("../models/user");
const bcrypt = require("bcryptjs");
const transporter = require("../config/mailer");

registerUser = async (req, res) => {
  const { name,    email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to DB
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Registration Successful",
      text: `Hi ${user.name},\n\nThank you for registering with us!`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email send failed:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res
      .status(201)
      .json({ message: "User registered successfully and email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter both email and password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Optional: You can return user or a token here
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerUser , loginUser};
