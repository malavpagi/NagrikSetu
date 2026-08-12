import ComplaintCollection from "../models/Complaint.model.js";
import DepartmentCollection from "../models/Department.model.js";
import UserCollection from "../models/User.model.js";         // Ensures User model registration
import EvidenceCollection from "../models/Evidence.model.js"; // Ensures Evidence model registration


// GET /api/official/complaints?category=incoming|processing|processed
export const getComplaints = async (req, res) => {
  try {
    const { category } = req.query;
    const user = req.user; // Set by verifyToken middleware

    // Resolve official's department
    let departmentFilter = {};
    if (user.departmentCode) {
      const dept = await DepartmentCollection.findOne({ code: user.departmentCode });
      if (dept) {
        departmentFilter.departmentId = dept._id;
      }
    }

    let statusFilter = [];
    if (category === "incoming") {
      statusFilter = ["SUBMITTED", "UNDER_REVIEW"];
    } else if (category === "processing") {
      statusFilter = ["WORK_IN_PROGRESS"];
    } else if (category === "processed") {
      statusFilter = ["RESOLVED", "REJECTED"];
    } else {
      statusFilter = ["SUBMITTED", "UNDER_REVIEW", "WORK_IN_PROGRESS", "RESOLVED", "REJECTED"];
    }

    const query = {
      ...departmentFilter,
      status: { $in: statusFilter },
    };

    const complaints = await ComplaintCollection.find(query)
      .populate("userIds", "username fullName email")
      .populate("evidenceIds", "imagePath latitude longitude capturedAt")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    console.error("Error fetching official complaints:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaints.",
    });
  }
};

// PATCH /api/official/complaints/:id/status
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const validStatuses = ["SUBMITTED", "UNDER_REVIEW", "WORK_IN_PROGRESS", "RESOLVED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value provided.",
      });
    }

    const updatePayload = { status };
    if (status === "REJECTED") {
      updatePayload.rejectionReason = rejectionReason || "No reason provided.";
    }

    const updatedComplaint = await ComplaintCollection.findByIdAndUpdate(
      id,
      updatePayload,
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Complaint status updated successfully.",
      data: updatedComplaint,
    });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update complaint status.",
    });
  }
};