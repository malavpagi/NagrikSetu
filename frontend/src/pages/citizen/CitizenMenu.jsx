import { useNavigate } from "react-router-dom";

const ACTIONS = [
  { to: "/citizen/capture", icon: "\u25CE", label: "Capture evidence", tint: "var(--teal-tint)", ring: "var(--teal)" },
  { to: "/citizen/make-complaint", icon: "\u270E", label: "Make a complaint", tint: "var(--marigold-tint)", ring: "var(--marigold-dark)" },
  { to: "/citizen/evidences", icon: "\u25A6", label: "My evidences", tint: "var(--brick-tint)", ring: "var(--brick)" },
  { to: "/citizen/my-complaints", icon: "\u2261", label: "My complaints", tint: "var(--forest-tint)", ring: "var(--forest)" },
];

function CitizenMenu() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col">
      <h2 className="font-display font-bold text-xl" style={{ color: "var(--ink)" }}>
        What would you like to do?
      </h2>
      <p className="text-sm mt-1 mb-6" style={{ color: "var(--ink-soft)" }}>
        Every report starts with a photo and ends with a status you can track.
      </p>

      <div className="grid grid-cols-2 gap-3.5">
        {ACTIONS.map((a) => (
          <button
            key={a.to}
            onClick={() => navigate(a.to)}
            className="ns-card ns-card-interactive flex flex-col items-center justify-center gap-3 py-8 px-3 text-center"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ background: a.tint, color: a.ring }}
            >
              {a.icon}
            </div>
            <span className="font-semibold text-sm" style={{ color: "var(--ink)" }}>
              {a.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CitizenMenu;
