// Fixed, full-viewport ambient background: a faint grid with slowly drifting
// aurora glows. Pure CSS (transform-only animations), respects reduced-motion,
// and adapts to light/dark via CSS variables.
export function AnimatedBackground() {
  return (
    <div className="aurora-bg" aria-hidden>
      <div className="aurora-grid" />
      <div className="aurora-blob aurora-blob--1" />
      <div className="aurora-blob aurora-blob--2" />
      <div className="aurora-blob aurora-blob--3" />
    </div>
  );
}
