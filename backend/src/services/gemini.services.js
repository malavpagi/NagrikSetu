import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

// Initialize the SDK. Ensure you have GEMINI_API_KEY in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to convert local file to the format Gemini expects
function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType
    },
  };
}

export const validateComplaintWithAI = async (imagePath, userDescription) => {
  // Use flash-lite (or gemini-1.5-flash if lite isn't available in your region's SDK tier yet)
  const model = genAI.getGenerativeModel({ 
    model: "gemini-3.5-flash-lite", // or "gemini-1.5-flash"
    generationConfig: {
      responseMimeType: "application/json", // FIXES PROBLEM 1: Forces pure JSON
    }
  });

  // FIXES PROBLEM 2: Strict Prompting
  const prompt = `
    You are an AI assistant for a Citizen Grievance Management Platform.

    Analyze the provided image and citizen description:
    "${userDescription}"

    Your tasks:

    1. IMAGE VALIDATION
    - Check whether the image clearly shows a genuine civic issue.
    - Reject if it is unrelated, blank, extremely blurry/dark, inappropriate, or unusable.
    - Do not assume a poor-quality image is fraud.

    2. DESCRIPTION VALIDATION
    - Check whether the description meaningfully describes a civic problem.
    - Grammar/spelling mistakes are allowed and must NOT cause rejection.
    - Reject descriptions that are empty, meaningless, abusive, inappropriate, spam, or unrelated.

    3. IMAGE + DESCRIPTION
    - Check whether the image and description describe the same problem.
    - Reject if the description is unrelated, blank, entremely poor, inappropriate, or unusable.
    - They do not need to contain exactly the same details.
    - Reject only when they clearly contradict each other.

    4. SUSPICIOUS EVIDENCE
    - Detect obvious signs of manipulated, edited, or misleading images.
    - Do not claim an image is definitely fake.
    - Set suspiciousEvidence=true only when there are strong visible indications.
    - You cannot verify whether the reported problem actually exists at the GPS location.

    5. GRAMMAR
    - Correct spelling and grammar while preserving the citizen's original meaning.
    - Do not add facts that the citizen did not provide.

    6. DEPARTMENT
    Choose ONLY one from:
    [
      "ROAD_MAINTENANCE",
      "WATER_SUPPLY",
      "SANITATION",
      "SOLID_WASTE_MANAGEMENT",
      "ELECTRICITY",
      "SEWERAGE_AND_DRAINAGE",
      "TRAFFIC_MANAGEMENT",
      "PARKS_AND_GARDENS",
      "ENCROACHMENT",
      "PUBLIC_HEALTH"
    ]

    Never create a new department. If no department fits, set department=null and isValidComplaint=false.

    Examples:
    Pothole/damaged road → ROAD_MAINTENANCE
    Water leakage → WATER_SUPPLY
    Garbage dumping → SOLID_WASTE_MANAGEMENT
    Blocked drain → SEWERAGE_AND_DRAINAGE
    Broken street light → ELECTRICITY

    7. PROBLEM TYPE
    Return a short type such as:
    "POTHOLE", "ROAD_DAMAGE", "WATER_LEAKAGE", "BROKEN_PIPE",
    "GARBAGE_DUMPING", "OVERFLOWING_DRAIN", "BROKEN_STREET_LIGHT".

    8. SEVERITY
    Estimate:
    "LOW", "MEDIUM", or "HIGH".
    Use null if insufficient information.

    9. VALIDITY
    isValidComplaint=true only if:
    - Image is relevant and usable.
    - Description is meaningful and relevant.
    - Image and description match.
    - It represents a civic issue.
    - A predefined department can be identified.

    Otherwise set isValidComplaint=false.

    IMPORTANT:
    A rejected complaint does NOT automatically mean the user is fraudulent.
    The backend will separately track repeated rejected complaints.

    RESPOND ONLY WITH VALID JSON:

    {
      "isValidComplaint": boolean,
      "reason": string | null,
      "imageRelevant": boolean,
      "descriptionRelevant": boolean,
      "imageDescriptionMatch": boolean,
      "suspiciousEvidence": boolean,
      "department": string | null,
      "problemType": string | null,
      "severity": "LOW" | "MEDIUM" | "HIGH" | null,
      "summary": string | null
    }
  `;

  try {
    const imagePart = fileToGenerativePart(imagePath, "image/jpeg"); // FIXES PROBLEM 3

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();
    
    // Parse the strict JSON returned by Gemini
    return JSON.parse(responseText);
    
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    // Graceful fallback if API fails
    return {
      isValidComplaint: false,
      reason: "AI_SERVICE_UNAVAILABLE",
    };
  }
};