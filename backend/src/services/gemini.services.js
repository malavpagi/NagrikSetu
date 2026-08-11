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
    Analyze the provided image and the user's description: "${userDescription}".
    
    Rules:
    1. Check if the image shows a valid civic issue.
    2. Check if the text matches the image.
    3. Correct any grammar in the text to create a clean summary.
    4. Categorize the department ONLY from this exact list:
       ["ROAD_MAINTENANCE", "WATER_SUPPLY", "SANITATION", "SOLID_WASTE_MANAGEMENT", "ELECTRICITY", "SEWERAGE_AND_DRAINAGE", "TRAFFIC_MANAGEMENT", "PARKS_AND_GARDENS", "ENCROACHMENT", "PUBLIC_HEALTH"]
       Do not invent new departments! If it doesn't fit, pick the closest or mark as invalid.
    
    You must respond exactly with this JSON schema:
    {
      "isValidComplaint": boolean,
      "reason": string | null (if invalid, explain why briefly. e.g., "Image is of a dog"),
      "imageRelevant": boolean,
      "descriptionRelevant": boolean,
      "imageDescriptionMatch": boolean,
      "department": string | null (from the allowed list only),
      "problemType": string | null (e.g., "POTHOLE", "BROKEN_PIPE"),
      "severity": "LOW" | "MEDIUM" | "HIGH" | null,
      "summary": string | null (Grammatically corrected user description)
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