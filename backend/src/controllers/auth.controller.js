import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserCollection from "../models/User.model.js";

// ==========================================
// 2. REGISTER USER CONTROLLER
// ==========================================
export const registerUserFunct = async (req, res) => {
  try {
    const { userName, fullName, mobileNo, email, password } = req.body;

    // Basic validation
    if (!userName || !fullName || !mobileNo || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if user already exists
    const existingUser = await UserCollection.findOne({
      $or: [{ email }, { username: userName }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this username or email already exists.",
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user (Enforcing CITIZEN role)
    const newUser = await UserCollection.create({
      username: userName,
      fullName,
      mobile: mobileNo,
      email,
      passwordHash,
      role: "CITIZEN",
      employeeId: null,
      departmentId: null,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during registration.",
    });
  }
};

// ==========================================
// 2. LOGIN USER CONTROLLER
// ==========================================
export const loginUserFunct = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Basic validation
    if (!userName || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    // Find user by username
    const user = await UserCollection.findOne({ username: userName });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact administration.",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Generate accessToken JWT Token
    const accessToken = jwt.sign(
      {userId: user._id, role: user.role, departmentId: user.departmentId},
      process.env.JWT_ACCESS_TOKEN_SECRET || "fallback_secret_key",
      { expiresIn: "3m" }       // 3 min
    );

    const refreshToken = jwt.sign(
        {userId: user._id,},
        process.env.JWT_REFRESH_TOKEN_SECRET,
        {expiresIn : "10m"}      //
    );

    // Set HTTP-Only Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 60 * 1000, // 10  * 60 * 1 ms = 10*60 seconds  = 10 mins
    });

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
      },
      accessToken 
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login.",
    });
  }
};


// ==========================================
// 3. REFRESH TOKEN CONTROLLER
// ==========================================
export const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token missing",
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET
        );

        const newAccessToken = jwt.sign(
            {userId: decoded.userId, role: decoded.role, departmentId: decoded.departmentId},
            process.env.JWT_ACCESS_TOKEN_SECRET,
            {expiresIn: "3m"}
        );

        return res.status(200).json({
            success: true,
            accessToken: newAccessToken,
        });

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token",
        });
    }
};