import { useNavigate } from "react-router-dom";
import BrandMark from "../../components/BrandMark.jsx";

const ISSUE_TAGS = ["Potholes", "Streetlights", "Garbage", "Water Leakage", "Encroachment", "Drainage"];

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-body" style={{ background: "var(--paper)", color: "var(--ink)" }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 sm:px-10 py-5">
        <div className="flex items-center gap-2">
          <span
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "var(--teal)" }}
          >
            <BrandMark size={20} />
          </span>
          <span className="font-display font-bold text-lg tracking-tight">Nagrik-Setu</span>
        </div>
        <button onClick={() => navigate("/login")} className="ns-btn ns-btn-ghost text-sm">
          Log in
        </button>
      </header>

      {/* Hero */}
      <main className="px-5 sm:px-10">
        <div className="max-w-5xl mx-auto pt-8 sm:pt-16 pb-10 text-center">
          <span
            className="ns-stamp ns-stamp-review mb-6 inline-flex"
            style={{ transform: "rotate(-3deg)" }}
          >
            Civic reporting, made accountable
          </span>

          <h1 className="font-display font-bold leading-[1.05] text-[2.5rem] sm:text-[3.75rem] tracking-tight mt-2">
            The bridge between
            <br />
            <span style={{ color: "var(--teal)" }}>every citizen</span> and
            <br />
            their civic body
          </h1>

          <p className="mt-6 max-w-xl mx-auto text-base sm:text-lg" style={{ color: "var(--ink-soft)" }}>
            Photograph the problem, drop a pin, and Nagrik-Setu routes it — with proof —
            to the department that owns it. Track every complaint from submission to resolution.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={() => navigate("/register")}
              className="ns-btn ns-btn-accent w-full sm:w-auto text-[0.95rem] px-7 py-3"
            >
              Report an issue — Register
            </button>
            <button
              onClick={() => navigate("/login")}
              className="ns-btn ns-btn-ghost w-full sm:w-auto text-[0.95rem] px-7 py-3"
            >
              I already have an account
            </button>
          </div>
        </div>

        {/* Bridge illustration: citizen pier — span — official pier */}
        <div className="max-w-4xl mx-auto mt-6 mb-14">
          <svg viewBox="0 0 640 170" className="w-full h-auto" aria-hidden="true">
            <path
              d="M40 120 C 160 40, 480 40, 600 120"
              stroke="var(--teal)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {[80, 160, 240, 320, 400, 480, 560].map((x, i) => (
              <line
                key={x}
                x1={x}
                y1={120 - Math.sin((i / 6) * Math.PI) * 78}
                x2={x}
                y2="150"
                stroke="var(--border)"
                strokeWidth="2"
              />
            ))}
            <rect x="20" y="120" width="40" height="34" rx="4" fill="var(--marigold-tint)" stroke="var(--marigold-dark)" strokeWidth="1.5" />
            <rect x="580" y="120" width="40" height="34" rx="4" fill="var(--teal-tint)" stroke="var(--teal)" strokeWidth="1.5" />
            <text x="40" y="163" textAnchor="middle" className="font-mono" fontSize="10" fill="var(--ink-soft)">CITIZEN</text>
            <text x="600" y="163" textAnchor="middle" className="font-mono" fontSize="10" fill="var(--ink-soft)">CIVIC BODY</text>
          </svg>
        </div>

        {/* Issue tag strip */}
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-2 pb-20">
          {ISSUE_TAGS.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-3 py-1.5 rounded-full font-mono"
              style={{ background: "var(--paper-card)", border: "1px solid var(--border)", color: "var(--ink-soft)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </main>

      <footer className="text-center pb-8 text-xs font-mono" style={{ color: "var(--ink-faint)" }}>
        Nagrik-Setu · a citizen–government reporting bridge
      </footer>
    </div>
  );
}

export default LandingPage;
