// Drives a single pet: bottom/middle/top placement, parade/left/right motion,
// click-to-pet hearts, and periodic motivational bubbles.
// Ported from the extension's content.js, retargeted to the overlay document.
class PetWalker {
  constructor(root, opts) {
    this.root = root;                 // #stage element
    this.petEl = root.querySelector('#pet');
    this.assetBase = opts.assetBase;  // 'assets/pets'
    this.state = 'paused';            // 'walking' | 'paused'
    this.x = 0;
    this.dir = 1;
    this.speedPerSec = 80;            // px per SECOND — frame-rate independent (60Hz == 120Hz)
    this.size = 90;
    this.theme = opts.theme || 'light';
    this.motivationEnabled = opts.motivationEnabled !== false;
    this.position = opts.position || 'bottom';     // bottom | middle | top
    this.motionMode = opts.motionMode || 'parade'; // parade | left | right
    this.enabled = false;             // is the pet currently active/shown?
    this._suspended = false;          // paused because the overlay isn't visible (occluded/asleep)
    this._raf = null;
    this._lastTime = null;
    this._motivationTimer = null;
    this._onClick = () => this._spawnHearts();
    this.petEl.addEventListener('click', this._onClick);
    this._applyVertical();
  }

  setPet(species, variant) {
    this.petEl.style.background = 'transparent';
    this.petEl.src = `${this.assetBase}/${species}-${variant}.png`;
  }

  setTheme(theme) { this.theme = theme; }

  setMotivation(enabled) {
    this.motivationEnabled = enabled;
    if (enabled && this.enabled) this._scheduleMotivation();
    else if (this._motivationTimer) { clearTimeout(this._motivationTimer); this._motivationTimer = null; }
  }

  setPosition(pos) { this.position = pos; this._applyVertical(); }
  setMotion(mode) { this.motionMode = mode; this._applyMotion(); }

  // Called when the pet becomes enabled.
  start() {
    this.enabled = true;
    this.petEl.style.display = '';
    this._applyVertical();
    this._applyMotion();
    if (this.motivationEnabled) this._scheduleMotivation();
  }

  // Called when the pet becomes disabled.
  stop() {
    this.enabled = false;
    this._stopWalk();
    if (this._motivationTimer) { clearTimeout(this._motivationTimer); this._motivationTimer = null; }
  }

  // Vertical placement — matches the browser extension exactly: the pet lives in
  // a band near the BOTTOM and position only lifts it a little (px up from the
  // bottom), NOT across the whole screen. bottom=0, middle=50, top=100.
  _applyVertical() {
    const OFFSETS = { bottom: 0, middle: 50, top: 100 };
    const off = OFFSETS[this.position] != null ? OFFSETS[this.position] : 0;
    this.petEl.style.top = '';
    this.petEl.style.bottom = `${off}px`;
  }

  // Pause/resume driven by overlay visibility (occlusion, display sleep, lock).
  suspend() {
    if (this._suspended) return;
    this._suspended = true;
    this._stopWalk();
    if (this._motivationTimer) { clearTimeout(this._motivationTimer); this._motivationTimer = null; }
  }

  resume() {
    if (!this._suspended) return;
    this._suspended = false;
    if (this.enabled) {
      this._applyMotion();
      if (this.motivationEnabled) this._scheduleMotivation();
    }
  }

  // Horizontal behaviour: parade = walk; left/right = sit at that edge.
  _applyMotion() {
    if (!this.enabled || this._suspended) return;
    if (this.motionMode === 'parade') {
      this._startWalk();
      return;
    }
    this._stopWalk();
    const INSET = 25; // matches the extension's 25px edge inset for left/right
    const max = Math.max(0, window.innerWidth - this.size);
    this.x = this.motionMode === 'right' ? Math.max(0, max - INSET) : Math.min(max, INSET);
    this.dir = this.motionMode === 'right' ? -1 : 1;
    this._render();
  }

  _startWalk() {
    if (this.state === 'walking') return;
    this.state = 'walking';
    this._lastTime = null; // reset so resuming never causes a jump
    this._loop();
  }

  _stopWalk() {
    this.state = 'paused';
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
  }

  _render() {
    // GPU-composited move: translate3d + flip. No `left` layout thrash (smoother).
    this.petEl.style.transform = `translate3d(${this.x}px, 0, 0) scaleX(${this.dir === 1 ? 1 : -1})`;
  }

  _loop(now) {
    const t = typeof now === 'number' ? now : 0;
    if (this._lastTime == null) this._lastTime = t;
    // Delta time in seconds, clamped so a hidden/background gap can't teleport the pet.
    const dt = Math.min(0.05, (t - this._lastTime) / 1000);
    this._lastTime = t;

    const max = Math.max(0, window.innerWidth - this.size);
    const stepPx = this.speedPerSec * dt;
    const step = window.nextStep({ x: this.x, dir: this.dir, min: 0, max, speed: stepPx });
    this.x = step.x;
    this.dir = step.dir;
    this._render();

    if (this.state === 'walking') this._raf = requestAnimationFrame((ts) => this._loop(ts));
  }

  _spawnHearts() {
    const rect = this.petEl.getBoundingClientRect();
    const baseX = rect.left + rect.width / 2;
    const baseY = rect.top;
    const emojis = ['❤️', '💖', '💕', '💗', '💓'];
    for (let i = 0; i < 5; i++) {
      const h = document.createElement('div');
      h.className = 'pb-heart';
      h.textContent = emojis[i % emojis.length];
      h.style.left = `${baseX + (i - 2) * 12}px`;
      h.style.top = `${baseY}px`;
      h.style.animation = `pb-heart-float 1.6s ease-out ${i * 80}ms forwards`;
      this.root.appendChild(h);
      setTimeout(() => h.remove(), 1800 + i * 80);
    }
  }

  _scheduleMotivation() {
    // Cancel any existing chain first — prevents overlapping timers from
    // stacking (which made messages fire far too frequently).
    if (this._motivationTimer) { clearTimeout(this._motivationTimer); this._motivationTimer = null; }

    const MESSAGES = [
      "You're doing great! 🌟", "Take a deep breath. You got this!",
      "Stay hydrated! 💧", "Small steps, big progress.",
      "One task at a time. ✨", "Be kind to yourself today.",
      "Progress over perfection.", "You make the day brighter 🌈"
    ];
    const FIRST = 60 * 1000, MIN = 4 * 60 * 1000, MAX = 8 * 60 * 1000, VISIBLE = 5000;
    const show = () => {
      const bubble = document.createElement('div');
      bubble.className = `pb-bubble theme-${this.theme}`;
      bubble.textContent = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      this.root.appendChild(bubble);
      let active = true;
      const track = () => {
        if (!active) return;
        const r = this.petEl.getBoundingClientRect();
        bubble.style.left = `${r.left + r.width / 2}px`;
        bubble.style.top = `${r.top - 48}px`;
        requestAnimationFrame(track);
      };
      track();
      setTimeout(() => { active = false; bubble.remove(); }, VISIBLE);
      this._motivationTimer = setTimeout(show, MIN + Math.random() * (MAX - MIN));
    };
    this._motivationTimer = setTimeout(show, FIRST);
  }
}

if (typeof window !== 'undefined') { window.PetWalker = PetWalker; }
