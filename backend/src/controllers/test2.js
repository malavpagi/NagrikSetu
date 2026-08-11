import { reverseGeocode } from "./test1.js";
const latitude = 22.28553215;
const longitude = 73.11926529;

try {
  const result = await reverseGeocode(latitude, longitude);

  console.log("Address:", result?.address);
  console.log("Details:", result?.details);
} catch (error) {
  console.error("Geocoding failed:", error.message);
}