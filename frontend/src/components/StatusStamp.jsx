// A small "ink stamp" badge used everywhere a status/state needs to be shown:
// complaint status, active/inactive officials, etc. Keeping this in one place
// means every list in the app (citizen, official, admin) reads consistently.

function StatusStamp({ status, label }) {
  const key = String(status || "").toLowerCase();
  return (
    <span className={`stamp stamp-${key}`}>
      {label || String(status || "").replace(/_/g, " ")}
    </span>
  );
}

export default StatusStamp;
