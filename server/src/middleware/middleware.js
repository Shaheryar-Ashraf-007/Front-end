import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const middleware = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not logged in" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Middleware error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
