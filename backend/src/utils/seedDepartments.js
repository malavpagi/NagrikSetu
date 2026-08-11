// backend/src/utils/seedDepartments.js
import mongoose from "mongoose";
import DepartmentCollection from "../models/Department.model.js";

const initialDepartments = [
  {
    name: "Roads & Infrastructure",
    code: "ROAD_MAINTENANCE",
    description: "Potholes, damaged roads, street paving, and bridge maintenance.",
  },
  {
    name: "Water Supply & Leakage",
    code: "WATER_SUPPLY",
    description: "Water pipeline leaks, supply disruptions, and water quality issues.",
  },
  {
    name: "Sanitation & Hygiene",
    code: "SANITATION",
    description: "Street sweeping, public restroom cleanliness, and area hygiene.",
  },
  {
    name: "Garbage & Waste Disposal",
    code: "SOLID_WASTE_MANAGEMENT",
    description: "Uncollected garbage, illegal dumping, and waste management.",
  },
  {
    name: "Street Lighting & Power",
    code: "ELECTRICITY",
    description: "Faulty streetlights, power outages, and loose electrical wiring.",
  },
  {
    name: "Sewerage & Drainage",
    code: "SEWERAGE_AND_DRAINAGE",
    description: "Blocked drains, overflowing sewage lines, and waterlogging.",
  },
  {
    name: "Traffic & Transport",
    code: "TRAFFIC_MANAGEMENT",
    description: "Broken traffic signals, missing road signage, and congestion.",
  },
  {
    name: "Parks & Greenery",
    code: "PARKS_AND_GARDENS",
    description: "Public park upkeep, fallen trees, and overgrown vegetation.",
  },
  {
    name: "Anti-Encroachment",
    code: "ENCROACHMENT",
    description: "Illegal structures, public space occupation, and footpath blockage.",
  },
  {
    name: "Public Health & Safety",
    code: "PUBLIC_HEALTH",
    description: "Stray animal control, pest control, and public health hazards.",
  },
];

export const seedDepartments = async () => {
  try {
    for (const dept of initialDepartments) {
      await DepartmentCollection.updateOne(
        { code: dept.code },
        { $setOnInsert: dept },
        { upsert: true }
      );
    }
    console.log("Departments seeded successfully.");
  } catch (error) {
    console.error("Error seeding departments:", error);
  }
};

//   import { seedDepartments } from "./src/utils/seedDepartments.js";
//   await seedDepartments(); dont run this function