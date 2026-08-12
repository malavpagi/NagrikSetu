import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import { getOfficialComplaintsApi } from "../../api/official.api";

// Custom Leaflet marker with priority-based styling
const createCustomIcon = (mergeCount, priority) => {
  const isHighRisk = mergeCount >= 3 || priority === "VERY_HIGH";
  const badgeColor = isHighRisk ? "#ef4444" : "#3b82f6";

  return L.divIcon({
    className: "custom-map-marker",
    html: `
      <div style="
        background-color: ${badgeColor};
        color: white;
        font-weight: bold;
        font-size: 11px;
        padding: 4px 8px;
        border-radius: 20px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        border: 2px solid white;
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
      ">
        <span>📍 ${mergeCount > 1 ? `Merged x${mergeCount}` : "Report"}</span>
      </div>
    `,
    iconSize: [80, 30],
    iconAnchor: [40, 15],
  });
};

function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    const heatPoints = points.map((p) => [p.lat, p.lng, p.intensity]);

    const heatLayer = L.heatLayer(heatPoints, {
      radius: 30,
      blur: 20,
      maxZoom: 16,
      max: 1.0,
      gradient: {
        0.1: "#3b82f6", // Blue (Low risk)
        0.3: "#06b6d4", // Cyan
        0.5: "#10b981", // Emerald Green
        0.7: "#f59e0b", // Amber/Yellow
        0.9: "#ef4444", // Red (High risk)
        1.0: "#7f1d1d", // Dark Crimson (Critical Danger)
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

function HeatMap() {
  const [heatData, setHeatData] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [stats, setStats] = useState({ total: 0, highRisk: 0, totalMerged: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActiveMapData() {
      try {
        setLoading(true);
        const incoming = await getOfficialComplaintsApi("incoming");
        const processing = await getOfficialComplaintsApi("processing");

        const activeComplaints = [
          ...(incoming.data || incoming),
          ...(processing.data || processing),
        ];

        const heatPoints = [];
        const markerPoints = [];
        let highRiskCount = 0;
        let totalMergedSum = 0;

        activeComplaints.forEach((item) => {
          totalMergedSum += item.mergeCount || 1;
          if (item.mergeCount >= 3 || item.priority === "VERY_HIGH") {
            highRiskCount++;
          }

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

            const intensity = Math.min(item.mergeCount * 0.25, 1.0);

            heatPoints.push({ lat: avgLat, lng: avgLng, intensity });
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

        setStats({
          total: activeComplaints.length,
          highRisk: highRiskCount,
          totalMerged: totalMergedSum,
        });

        setHeatData(heatPoints);
        setMarkers(markerPoints);
      } catch (err) {
        console.error("Heatmap fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchActiveMapData();
  }, []);

  if (loading)
    return <div style={{ padding: "20px", color: "#666" }}>Loading Interactive Heatmap...</div>;

  const mapCenter =
    markers.length > 0 ? [markers[0].lat, markers[0].lng] : [20.5937, 78.9629];

  return (
    <section style={{ fontFamily: "sans-serif", padding: "10px" }}>
      {/* Top Header & Analytics Summary Cards */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "22px", color: "#1e293b" }}>Real-time Risk Heat Map</h2>
          <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>
            Visualizing merged reports and active incident density.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ background: "#f1f5f9", padding: "10px 16px", borderRadius: "8px", textAlign: "center" }}>
            <span style={{ fontSize: "12px", color: "#64748b", display: "block" }}>Active Cards</span>
            <strong style={{ fontSize: "18px", color: "#0f172a" }}>{stats.total}</strong>
          </div>
          <div style={{ background: "#fef2f2", padding: "10px 16px", borderRadius: "8px", textAlign: "center" }}>
            <span style={{ fontSize: "12px", color: "#991b1b", display: "block" }}>High Risk Clusters</span>
            <strong style={{ fontSize: "18px", color: "#dc2626" }}>{stats.highRisk}</strong>
          </div>
          <div style={{ background: "#eff6ff", padding: "10px 16px", borderRadius: "8px", textAlign: "center" }}>
            <span style={{ fontSize: "12px", color: "#1e40af", display: "block" }}>Total Citizen Reports</span>
            <strong style={{ fontSize: "18px", color: "#2563eb" }}>{stats.totalMerged}</strong>
          </div>
        </div>
      </div>

      {/* Map Canvas with Sleek CartoDB Dark Matter Tiles */}
      <div
        style={{
          height: "620px",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          border: "1px solid #cbd5e1",
        }}
      >
        <MapContainer center={mapCenter} zoom={12} style={{ height: "100%", width: "100%" }}>
          {/* CartoDB Voyager / Dark tiles bring out vibrant heat gradients */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          <HeatmapLayer points={heatData} />

          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={createCustomIcon(marker.mergeCount, marker.priority)}
            >
              <Popup>
                <div style={{ padding: "4px", maxWidth: "240px" }}>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: marker.priority === "VERY_HIGH" ? "#fef2f2" : "#f0fdf4",
                      color: marker.priority === "VERY_HIGH" ? "#dc2626" : "#16a34a",
                    }}
                  >
                    Priority: {marker.priority}
                  </span>
                  <h4 style={{ margin: "8px 0 4px 0", fontSize: "15px" }}>{marker.problemType}</h4>
                  <p style={{ margin: "2px 0", fontSize: "13px", color: "#475569" }}>
                    <strong>Merged Complaints:</strong> {marker.mergeCount}
                  </p>
                  <p style={{ margin: "2px 0", fontSize: "13px", color: "#475569" }}>
                    <strong>Status:</strong> {marker.status}
                  </p>
                  <hr style={{ margin: "8px 0", borderTop: "1px solid #e2e8f0" }} />
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>
                    "{marker.aiSummary}"
                  </p>
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