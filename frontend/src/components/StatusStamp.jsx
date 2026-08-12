const STYLE_BY_STATUS = {
  SUBMITTED: "ns-stamp-neutral",
  UNDER_REVIEW: "ns-stamp-review",
  WORK_IN_PROGRESS: "ns-stamp-progress",
  RESOLVED: "ns-stamp-resolved",
  REJECTED: "ns-stamp-rejected",
};

/** Ink-seal style status badge — the app's signature visual element. */
function StatusStamp({ status }) {
  const style = STYLE_BY_STATUS[status] || "ns-stamp-neutral";
  return (
    <span className={`ns-stamp ${style}`}>
      {(status || "UNKNOWN").replace(/_/g, " ")}
    </span>
  );
}

export default StatusStamp;
