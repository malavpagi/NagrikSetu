import express from 'express';
import { 
    captureEvidence, 
    getEvidences, 
    submitComplaint, 
    getMyComplaints,
    deleteEvidence
} from '../controllers/citizen.controller.js'

const router = express.Router();
// Import your middlewares (Adjust paths to match your folder structure)
import { uploadEvidence } from '../middlewares/upload.middleware.js'; // Your multer middleware


// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/role.middleware.js";
// Middleware guard: Protect all admin routes
router.use(verifyToken);
router.use(verifyRole(["CITIZEN"]));


// ==========================================
// CITIZEN ROUTES
// ==========================================

// 1. Capture Evidence (Expects form-data with an 'image' file)
// Frontend calls: POST /api/citizen/evidence
router.post('/evidence', uploadEvidence.single('image'), captureEvidence);

// 2. View Captured Evidences
// Frontend calls: GET /api/citizen/evidences
router.get('/evidences', getEvidences);

// 3. Delete Evidence Route (Expects the ID in the URL)
// Frontend calls: DELETE /api/citizen/evidence/64f1a2b...
router.delete('/evidence/:id', deleteEvidence);

// 4. Submit a New Complaint (AI processing + Grouping)
// Frontend calls: POST /api/citizen/complaint
router.post('/complaint', submitComplaint);

// 5. View My Complaints
// Frontend calls: GET /api/citizen/complaints
router.get('/complaints', getMyComplaints);

export default router;