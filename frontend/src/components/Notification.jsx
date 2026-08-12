function Notification({ message, type = "info", onClose }) {
  const toneStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-800",
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
    error: "bg-rose-50 border-rose-200 text-rose-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 shadow-sm ${toneStyles[type] || toneStyles.info}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm leading-6">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-current opacity-70 transition hover:opacity-100"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Notification;
