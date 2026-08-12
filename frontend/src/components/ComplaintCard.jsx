import StatusStamp from "./StatusStamp.jsx";

const PRIORITY_COLOR = {
  HIGH: "var(--brick)",
  MEDIUM: "var(--marigold-dark)",
  LOW: "var(--forest)",
};

function ComplaintCard({ item, onClick }) {
  const priorityColor = PRIORITY_COLOR[item.priority] || "var(--ink-soft)";

  return (
    <article onClick={onClick} className="ns-card ns-card-interactive p-4 cursor-pointer">
      <div className="flex justify-between items-start gap-3 mb-2.5">
        <h3 className="font-display font-bold text-[0.95rem]" style={{ color: "var(--ink)" }}>
          {item.problemType}
        </h3>
        <StatusStamp status={item.status} />
      </div>

      <p className="text-sm mb-3" style={{ color: "var(--ink-soft)" }}>
        {item.aiSummary}
      </p>

      {item.rejectionReason && (
        <p className="text-xs mb-3 font-mono" style={{ color: "var(--brick)" }}>
          Rejection reason — {item.rejectionReason}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs font-mono pt-3" style={{ borderTop: "1px solid var(--border-soft)", color: "var(--ink-faint)" }}>
        <span style={{ color: priorityColor, fontWeight: 600 }}>{item.priority} PRIORITY</span>
        <span>MERGED &times;{item.mergeCount}</span>
      </div>
    </article>
  );
}

export default ComplaintCard;
