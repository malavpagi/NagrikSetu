const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

export async function reverseGeocode(lat, lon) {
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
    addressdetails: "1",
    zoom: "18",
    "accept-language": "en",
  });

    const response = await fetch(`${NOMINATIM_URL}?${params}`, {
    headers: {
        "User-Agent": "NagrikSetu/1.0 (your-email@gmail.com)",
        "Accept": "application/json",
    },
    });

    const responseText = await response.text();

    console.log("HTTP Status:", response.status);
    // console.log("Response:", responseText);

    if (!response.ok) {
    throw new Error(
        `Geocoding service returned HTTP ${response.status}: ${responseText}`
    );
    }

    const data = JSON.parse(responseText);

  if (!data || !data.display_name) {
    return null;
  }

  return {
    address: data.display_name,
    latitude: data.lat,
    longitude: data.lon,
    details: data.address,
  };
}