import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["CITIZEN", "DEPARTMENT_OFFICIAL", "SUPER_ADMIN"],
      required: true,
      default: "CITIZEN",
    },

    employeeId: {
      type: String,
      trim: true,
      default: null,
    },

    departmentCode: {
      type: String,
      ref: "Department",
      default: null,
    },

    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserCollection = mongoose.model("UserCollection", userSchema);

export default UserCollection;