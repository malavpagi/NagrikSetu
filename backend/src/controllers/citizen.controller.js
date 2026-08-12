import EvidenceCollection from '../models/Evidence.model.js';
import ComplaintCollection from '../models/Complaint.model.js';
import DepartmentCollection from '../models/Department.model.js'; 
import { validateComplaintWithAI } from '../services/gemini.services.js';
import { getCentroid, getDistanceInMeters, getPriorityLevel } from '../utils/geoUtils.js'
import crypto from 'crypto'; // For generating unique complaint string IDs
import fs from 'fs';
import path from 'path';


// Helper function: Reverse Geocoding (Nominatim API - Free)

export const getAddressFromCoords = async (lat, lon) => {
    const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";
    // Validate that values are numbers
    if (typeof lat !== "number" || typeof lon !== "number") {
        throw new Error("Latitude and longitude must be numbers.");
    }

    // Validate ranges
    if (lat < -90 || lat > 90) {
        throw new Error("Latitude must be between -90 and 90.");
    }

    if (lon < -180 || lon > 180) {
        throw new Error("Longitude must be between -180 and 180.");
    }

    const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        format: "json",
        addressdetails: "0",
        zoom: "18",
        "accept-language": "en",
    });

    const response = await fetch(`${NOMINATIM_URL}?${params}`, {
    headers: {
        // Nominatim requires a meaningful User-Agent
        "User-Agent": "YourHackathonApp/1.0 (malavpagi8@gmail.com)",
        },
    });

    if (!response.ok) {
        throw new Error(
        `Geocoding service returned HTTP ${response.status}`
        );  
    }

    const data = await response.json();

    try {
        return data.display_name || "Unknown Location";
    } catch(error) {
        return "Location unavailable";
    }
}

// ==========================================
// BUTTON 1: CAPTURE EVIDENCE
// ==========================================
export const captureEvidence = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "Image is required" });
        const { latitude, longitude, capturedAt } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: "GPS location is mandatory" });
        }

        const newEvidence = await EvidenceCollection.create({
            userId: req.user._id,
            imagePath: req.file.path,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            capturedAt: capturedAt || new Date() // Fallback to server time if mobile doesn't send it
        });

        res.status(201).json({ message: "Evidence captured", evidence: newEvidence });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to capture evidence" });
    }
};

// ==========================================
// BUTTON 2: VIEW EVIDENCES
// ==========================================
export const getEvidences = async (req, res) => {
    try {
        const evidences = await EvidenceCollection.find({ userId: req.user._id })
            .sort({ capturedAt: -1 });
        
        res.status(200).json({ evidences });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch evidences" });
    }
};

export const deleteEvidence = async (req, res) => {
    try {
        const evidenceId = req.params.id;
        const userId = req.user._id;

        // 1. Find the evidence and ensure it belongs to this user
        const evidence = await EvidenceCollection.findOne({ _id: evidenceId, userId: userId });
        if (!evidence) {
            return res.status(404).json({ error: "Evidence not found or unauthorized." });
        }

        // 2. Delete the physical image file from the server's disk
        const filePath = path.resolve(evidence.imagePath); 
        fs.unlink(filePath, (err) => {
            if (err) console.error("Warning: Failed to delete file from disk:", err);
        });

        // 3. Delete the document from MongoDB
        await EvidenceCollection.findByIdAndDelete(evidenceId);

        res.status(200).json({ success: true, message: "Evidence deleted successfully." });
    } catch (error) {
        console.error("Delete Evidence Error:", error);
        res.status(500).json({ error: "Failed to delete evidence." });
    }
};

// ==========================================
// BUTTON 3: MAKE COMPLAINT (AI Validation)
// ==========================================
export const submitComplaint = async (req, res) => {
    try {
        const { evidenceId, description, contactNumber } = req.body;
        const userid = req.user._id;

        // 1. Fetch Evidence
        const evidence = await EvidenceCollection.findById(evidenceId);
        if (!evidence) return res.status(404).json({ error: "Evidence not found" });

        // 2. Validate via AI
        const aiResult = await validateComplaintWithAI(evidence.imagePath, description);
        if (!aiResult.isValidComplaint) {
            return res.status(400).json({ success: false, reason: aiResult.reason });
        }

        // 3. Find Department
        const department = await DepartmentCollection.findOne({ code: aiResult.department });
        if (!department) {
            return res.status(400).json({ error: `Department ${aiResult.department} not configured in system.` });
        }

        // 4. Get Text Location via Geocoding
        const textLocation = await getAddressFromCoords(evidence.latitude, evidence.longitude);

        // 5. Generate Unique Complaint ID String (e.g., C-8f7a2b)
        const uniqueComplaintId = `C-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

        const activeCandidates = await ComplaintCollection.find({
            departmentId: department._id,
            problemType: aiResult.problemType.toUpperCase(), // Ensure string matching
            status: { $nin: ['RESOLVED', 'REJECTED'] } // Only active cases
        });

        let closestMatch = null;
        let shortestDistance = 50; // Max threshold is 50 meters

        for (const candidate of activeCandidates) {
            const centroid = getCentroid(candidate.locations);
            const distance = getDistanceInMeters(
                evidence.latitude, evidence.longitude,
                centroid.latitude, centroid.longitude
            );

            if (distance <= shortestDistance) {
                shortestDistance = distance;
                closestMatch = candidate;
            }
        }

        if (closestMatch) {
            // MERGE SCENARIO
            const newMergeCount = closestMatch.mergeCount + 1;
            
            // Push all new data into the arrays
            closestMatch.complaintIds.push(uniqueComplaintId);
            closestMatch.userIds.push(userid);
            closestMatch.evidenceIds.push(evidence._id);
            closestMatch.descriptions.push(description);
            closestMatch.locations.push({
                latitude: evidence.latitude,
                longitude: evidence.longitude,
                textLocation: textLocation
            });
            if (contactNumber) closestMatch.contactNumbers.push(contactNumber);

            // Update Count & Priority
            closestMatch.mergeCount = newMergeCount;
            closestMatch.priority = getPriorityLevel(newMergeCount);

            await closestMatch.save();


            return res.status(200).json({ 
                success: true, 
                message: "Complaint merged with existing active issue.", 
                complaintId: uniqueComplaintId,
                isMerged: true
            });

        } else {
            // CREATE NEW SCENARIO (No match found within 50m)
            const newComplaint = await ComplaintCollection.create({
                departmentId: department._id,
                departmentName: department.name,
                problemType: aiResult.problemType.toUpperCase(),
                complaintIds: [uniqueComplaintId],
                userIds: [userid],
                evidenceIds: [evidence._id],
                descriptions: [description],
                locations: [{
                    latitude: evidence.latitude,
                    longitude: evidence.longitude,
                    textLocation: textLocation
                }],
                contactNumbers: contactNumber ? [contactNumber] : [],
                aiSummary: aiResult.summary,
                severity: aiResult.severity,
                mergeCount: 1,
                priority: "NORMAL",
                status: "SUBMITTED"
            });

            return res.status(201).json({ 
                success: true, 
                message: "New complaint registered successfully.", 
                complaintId: uniqueComplaintId,
                isMerged: false
            });
        }

    } catch (error) {
        console.error("Complaint Submission Error:", error);
        res.status(500).json({ error: "Failed to process complaint" });
    }
};

// ==========================================
// BUTTON 4: VIEW COMPLAINTS
// ==========================================
export const getMyComplaints = async (req, res) => {
    try {
        // Find complaints where the citizen's ID is in the userIds array
        const complaints = await ComplaintCollection.find({ userIds: req.user._id })
            .populate('departmentId', 'departmentName') // Pulls the actual department name
            .populate('evidenceIds')          // Pulls the image paths
            .sort({ createdAt: -1 });

        res.status(200).json({ complaints });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch complaints" });
    }
};