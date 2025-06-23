const User = require("../models/user");
const bcrypt = require("bcryptjs");
const transporter = require("../config/mailer");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/custom-errror");

// 🔐 Helper: Create JWT token
const createToken = (user) => {
  return jwt.sign(
    {  email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// 📩 Helper: Send confirmation email
const sendConfirmationEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Registration Successful",
    text: `Hi ${name},\n\nThank you for registering with us!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Failed to send email:", err.message);
  }
};

// ✅ Register User
const registerUser = async (req, res, next) => {
  const { userName, email, password } = req.body;

  try {
    if (!userName || !email || !password) {
      throw new CustomError("Name, email, and password are required", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
     throw new CustomError("User already exists with this email", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ userName, email, password: hashedPassword });
    await user.save();

    await sendConfirmationEmail(email, userName);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    next(err); // Global error handler
  }
};

// ✅ Login User


const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new CustomError("Email and password are required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("Invalid email or password", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError("Invalid email or password", 400);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};


module.exports = { registerUser, loginUser };
