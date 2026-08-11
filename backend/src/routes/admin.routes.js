import express from "express";
import {
  getOfficials,
  getOfficialById,
  createOfficial,
  updateOfficial,
  deleteOfficial,
  getDepartments,
} from "../controllers/admin.controller.js";



const router = express.Router();



// Officials endpoints
router.get("/officials", getOfficials);
router.get("/officials/:id", getOfficialById);
router.put("/officials/:id", updateOfficial);
router.delete("/officials/:id", deleteOfficial);

// Departments endpoint
router.get("/departments", getDepartments);

router.post("/officials", createOfficial);

export default router;



// Make sure paths match your actual middleware filenames
// import { verifyToken } from "../middlewares/auth.middleware.js";
// import { verifyRole } from "../middlewares/role.middleware.js";
// // Middleware guard: Protect all admin routes
// router.use(verifyToken);
// router.use(verifyRole(["SUPER_ADMIN"]));