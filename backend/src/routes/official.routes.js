import express from "express";
import {
  getComplaints,
  updateComplaintStatus,
} from "../controllers/official.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(["DEPARTMENT_OFFICIAL", "SUPER_ADMIN"]));

router.get("/complaints", getComplaints);
router.patch("/complaints/:id/status", updateComplaintStatus);

export default router;