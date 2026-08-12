/** Two piers joined by a span — the "Setu" (bridge) that names the platform. */
function BrandMark({ size = 30, tone = "light" }) {
  const stroke = tone === "light" ? "#fdfdfb" : "#0f5c56";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M4 22c2.5-6 6-9 12-9s9.5 3 12 9"
        stroke={stroke}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <line x1="8" y1="22" x2="8" y2="27" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="24" y1="22" x2="24" y2="27" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="16" cy="12.2" r="2" fill={stroke} />
    </svg>
  );
}

export default BrandMark;
