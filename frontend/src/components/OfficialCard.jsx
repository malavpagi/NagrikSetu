function OfficialCard({ official, onEdit, onDelete }) {
  const initials = (official.fullName || official.username || "?")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="ns-card p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0"
          style={{ background: "var(--teal-tint)", color: "var(--teal-dark)" }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-[0.95rem] truncate" style={{ color: "var(--ink)" }}>
            {official.fullName}
          </h3>
          <p className="text-xs font-mono" style={{ color: "var(--ink-faint)" }}>@{official.username}</p>
        </div>
      </div>

      <div className="text-xs font-mono flex flex-col gap-1" style={{ color: "var(--ink-soft)" }}>
        <p>{official.mobile}</p>
        <p className="truncate">{official.email}</p>
        <p>
          <span
            className="px-2 py-0.5 rounded-full"
            style={{ background: "var(--marigold-tint)", color: "var(--marigold-dark)" }}
          >
            {official.departmentCode || "N/A"}
          </span>
        </p>
      </div>

      <div className="flex gap-2 mt-1">
        <button onClick={onEdit} className="ns-btn ns-btn-ghost text-xs flex-1 py-1.5">Edit</button>
        <button onClick={onDelete} className="ns-btn ns-btn-danger text-xs flex-1 py-1.5">Delete</button>
      </div>
    </article>
  );
}

export default OfficialCard;
