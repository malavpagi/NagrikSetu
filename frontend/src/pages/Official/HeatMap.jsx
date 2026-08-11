import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import { getOfficialComplaintsApi } from "../../api/official.api";

// Fix standard Leaflet default marker icon path issue in Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Helper component to bind `leaflet.heat` to the Leaflet map instance
function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    // Heat points format: [latitude, longitude, intensity/weight]
    // Intensity is normalized based on merge count
    const heatPoints = points.map((p) => [p.lat, p.lng, p.intensity]);

    const heatLayer = L.heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      max: 1.0, // Scale maximum threshold
      gradient: {
        0.2: "blue",
        0.4: "lime",
        0.6: "yellow",
        0.8: "orange",
        1.0: "red", // Higher mergeCount shifts directly into dark red
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

function HeatMap() {
  const [complaints, setComplaints] = useState([]);
  const [heatData, setHeatData] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMapData() {
      try {
        setLoading(true);
        // Fetch incoming and processing complaints (excludes RESOLVED and REJECTED)
        const incoming = await getOfficialComplaintsApi("incoming");
        const processing = await getOfficialComplaintsApi("processing");

        const activeList = [
          ...(incoming.data || incoming),
          ...(processing.data || processing),
        ];

        setComplaints(activeList);

        const heatPoints = [];
        const markerPoints = [];

        activeList.forEach((item) => {
          // Compute average or center coordinate for the complaint card
          const validLocations = item.locations?.filter(
            (loc) => loc.latitude && loc.longitude
          );

          if (validLocations && validLocations.length > 0) {
            const avgLat =
              validLocations.reduce((sum, loc) => sum + loc.latitude, 0) /
              validLocations.length;
            const avgLng =
              validLocations.reduce((sum, loc) => sum + loc.longitude, 0) /
              validLocations.length;

            // MergeCount risk weighting: 1 report = 0.3 (Blue/Green), 3+ reports = 0.8+ (Red danger)
            const normalizedIntensity = Math.min(item.mergeCount * 0.25, 1.0);

            heatPoints.push({
              lat: avgLat,
              lng: avgLng,
              intensity: normalizedIntensity,
            });

            markerPoints.push({
              id: item._id,
              lat: avgLat,
              lng: avgLng,
              problemType: item.problemType,
              mergeCount: item.mergeCount,
              priority: item.priority,
              status: item.status,
              aiSummary: item.aiSummary,
            });
          }
        });

        setHeatData(heatPoints);
        setMarkers(markerPoints);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load heat map data.");
      } finally {
        setLoading(false);
      }
    }

    fetchMapData();
  }, []);

  if (loading) return <div>Loading complaint heatmap...</div>;
  if (error) return <div>Error: {error}</div>;

  // Default center set to center point or fallback (e.g., India coordinates [20.5937, 78.9629])
  const defaultCenter =
    markers.length > 0 ? [markers[0].lat, markers[0].lng] : [20.5937, 78.9629];

  return (
    <section>
      <h2>Active Complaint Heat Map</h2>
      <p style={{ fontSize: "14px", color: "#666" }}>
        Note: Colors transition from Blue/Green (low frequency) to <strong>Dark Red</strong> (high merge count danger zone). Resolved and Rejected complaints are hidden automatically.
      </p>

      <div style={{ height: "600px", width: "100%", marginTop: "15px" }}>
        <MapContainer
          center={defaultCenter}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://www.openstreetmap.org/tile/{z}/{x}/{y}.png"
          />

          {/* Heatmap intensity layer */}
          <HeatmapLayer points={heatData} />

          {/* Single marker per complaint card with popup details */}
          {markers.map((marker) => (
            <Marker key={marker.id} position={[marker.lat, marker.lng]}>
              <Popup>
                <div>
                  <h4>{marker.problemType}</h4>
                  <p><strong>Merge Count (Risk):</strong> {marker.mergeCount}</p>
                  <p><strong>Priority:</strong> {marker.priority}</p>
                  <p><strong>Status:</strong> {marker.status}</p>
                  <p><strong>AI Summary:</strong> {marker.aiSummary}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}

export default HeatMap;