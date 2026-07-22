// Pure one-step pacing along a 1-D track [min, max].
// Returns the next {x, dir}, clamping to bounds and flipping at edges.
// UMD-style export: works under Node require() (tests) AND as a browser <script>.
function nextStep({ x, dir, min, max, speed }) {
  let nx = x + dir * speed;
  let ndir = dir;
  if (nx >= max) { nx = max; ndir = -1; }
  else if (nx <= min) { nx = min; ndir = 1; }
  return { x: nx, dir: ndir };
}

if (typeof module !== 'undefined' && module.exports) { module.exports = { nextStep }; }
if (typeof window !== 'undefined') { window.nextStep = nextStep; }
