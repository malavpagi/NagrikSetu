import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    departmentName : {
      type : String,
      required : true,
      trim : true,
    },

    problemType: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    complaintIds: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    userIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    evidenceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Evidence",
        required: true,
      },
    ],

    descriptions: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    locations: [
      {
        latitude: {
          type: Number,
          required: true,
        },

        longitude: {
          type: Number,
          required: true,
        },

        textLocation: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    contactNumbers: [
      {
        type: String,
        trim: true,
        default: null
      },
    ],

    aiSummary: {
      type: String,
      required: true,
      trim: true,
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      required: true,
    },

    mergeCount: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    priority: {
      type: String,
      enum: ["NORMAL", "HIGH", "VERY_HIGH"],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "SUBMITTED",
        "UNDER_REVIEW",
        "ASSIGNED",
        "WORK_IN_PROGRESS",
        "RESOLVED",
        "REJECTED",
      ],
      required: true,
      default: "SUBMITTED",
    },

    rejectionReason: {
      type: String,
      required: false,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ComplaintCollection = mongoose.model("ComplaintCollection", complaintSchema);

export default ComplaintCollection;
