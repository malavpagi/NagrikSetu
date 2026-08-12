// Minimal line icons (24x24 viewBox, inherit color via currentColor/stroke).
// Kept hand-rolled and small on purpose, instead of pulling in an icon
// library, so the mark set stays consistent with the rest of the page.

const base = {
  width: 22,
  height: 22,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconHome(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3.5 11.5 12 4l8.5 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H10v-5.5h4V20h3.5a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function IconCamera(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.4" />
    </svg>
  );
}

export function IconNote(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M6 3.5h9l3.5 3.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M15 3.5V7h3.5" />
      <path d="M8 12h6M8 15.2h6M8 8.8h3" />
    </svg>
  );
}

export function IconGallery(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.2" />
      <circle cx="8.3" cy="9.3" r="1.5" />
      <path d="m5 17 4.5-5 3 3.2L16 11l3 4" />
    </svg>
  );
}

export function IconList(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M8.5 6h11M8.5 12h11M8.5 18h11" />
      <path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" strokeWidth="2.4" />
    </svg>
  );
}

export function IconTrash(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4.5 7h15M9.5 7V5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2M18 7l-.8 12a1 1 0 0 1-1 1H7.8a1 1 0 0 1-1-1L6 7" />
      <path d="M10.2 11v6M13.8 11v6" />
    </svg>
  );
}

export function IconClose(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconMap(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}

export function IconLogout(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M9 20H5.5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1H9" />
      <path d="M14 16.5 19 12l-5-4.5M19 12H9" />
    </svg>
  );
}
