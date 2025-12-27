import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Check against admin credentials from .env
    const isEmailValid = email === process.env.ADMIN_EMAIL;
    const isPasswordValid = password === process.env.ADMIN_PASSWORD;

    if (!isEmailValid || !isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "15m" }
    );

    // 4. Send token as cookie + response
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true if using HTTPS
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, 
    });

    return res.status(200).json({ message: "Login successful", token });
    
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
