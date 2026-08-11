import express from 'express';
import { 
    captureEvidence, 
    getEvidences, 
    submitComplaint, 
    getMyComplaints 
} from '../controllers/citizen.controller.js'

// Import your middlewares (Adjust paths to match your folder structure)
// import { verifyToken } from '../middlewares/auth.middleware.js';
import { uploadEvidence } from '../middlewares/upload.middleware.js'; // Your multer middleware

const router = express.Router();

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================
// Apply the auth middleware to all routes below. 
// This ensures the user is logged in and populates `req.userid`
// router.use(verifyToken); 


// ==========================================
// CITIZEN ROUTES
// ==========================================

// 1. Capture Evidence (Expects form-data with an 'image' file)
// Frontend calls: POST /api/citizen/evidence
router.post('/evidence', uploadEvidence.single('image'), captureEvidence);

// 2. View Captured Evidences
// Frontend calls: GET /api/citizen/evidences
router.get('/evidences', getEvidences);

// 3. Submit a New Complaint (AI processing + Grouping)
// Frontend calls: POST /api/citizen/complaint
router.post('/complaint', submitComplaint);

// 4. View My Complaints
// Frontend calls: GET /api/citizen/complaints
router.get('/complaints', getMyComplaints);

export default router;