import UserCollection from "../models/User.model.js";
import DepartmentCollection from "../models/Department.model.js";

import bcrypt from "bcryptjs";

// GET /api/admin/officials?active=true
export const getOfficials = async (req, res) => {
  try {
    const { active } = req.query;
    const filter = { role: "DEPARTMENT_OFFICIAL" };

    if (active !== undefined) {
      filter.isActive = active === "true";
    }

    const officials = await UserCollection.find(filter).select("-passwordHash");

    return res.status(200).json({
      success: true,
      data: officials,
    });
  } catch (error) {
    console.error("Error fetching officials:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch officials list.",
    });
  }
};

// GET /api/admin/officials/:id
export const getOfficialById = async (req, res) => {
  try {
    const official = await UserCollection.findById(req.params.id).select("-passwordHash");

    if (!official) {
      return res.status(404).json({
        success: false,
        message: "Official not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: official,
    });
  } catch (error) {
    console.error("Error fetching official details:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch official details.",
    });
  }
};

// PUT /api/admin/officials/:id
export const updateOfficial = async (req, res) => {
  try {
    const { username, fullName, email, mobile, departmentCode, isActive } = req.body;

    // Check if username or email is taken by another user
    const duplicateUser = await UserCollection.findOne({
      _id: { $ne: req.params.id },
      $or: [{ username }, { email }],
    });

    if (duplicateUser) {
      return res.status(400).json({
        success: false,
        message: "Username or Email is already in use by another user.",
      });
    }

    // Change this:
const updatedOfficial = await UserCollection.findByIdAndUpdate(
  req.params.id,
  {
    username,
    fullName,
    email,
    mobile,
    departmentCode: departmentCode ? departmentCode.toUpperCase() : null,
    isActive,
  },
  { returnDocument: 'after', runValidators: true } // Updated here
).select("-passwordHash");

    if (!updatedOfficial) {
      return res.status(404).json({
        success: false,
        message: "Official not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Official updated successfully.",
      data: updatedOfficial,
    });
  } catch (error) {
    console.error("Error updating official:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update official.",
    });
  }
};

// DELETE /api/admin/officials/:id
export const deleteOfficial = async (req, res) => {
  try {
    const deletedOfficial = await UserCollection.findByIdAndDelete(req.params.id);

    if (!deletedOfficial) {
      return res.status(404).json({
        success: false,
        message: "Official not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Official permanently deleted.",
    });
  } catch (error) {
    console.error("Error deleting official:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete official.",
    });
  }
};

// GET /api/admin/departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await DepartmentCollection.find({ isActive: true });
    return res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch departments.",
    });
  }
};


// POST /api/admin/officials
export const createOfficial = async (req, res) => {
  try {
    const { username, fullName, mobile, email, password, departmentCode, isActive } = req.body;

    if (!username || !fullName || !mobile || !email || !password || !departmentCode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingUser = await UserCollection.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Official with this username or email already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newOfficial = await UserCollection.create({
      username,
      fullName,
      mobile,
      email,
      passwordHash,
      role: "DEPARTMENT_OFFICIAL",
      departmentCode: departmentCode.toUpperCase(),
      isActive: isActive !== undefined ? isActive : true, // Accept isActive value from body
    });

    return res.status(201).json({
      success: true,
      message: "Official created successfully.",
      data: {
        _id: newOfficial._id,
        username: newOfficial.username,
        fullName: newOfficial.fullName,
        email: newOfficial.email,
        role: newOfficial.role,
        departmentCode: newOfficial.departmentCode,
        isActive: newOfficial.isActive,
      },
    });
  } catch (error) {
    console.error("Error creating official:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create official.",
    });
  }
};