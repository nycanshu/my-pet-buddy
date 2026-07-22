// Drives a single pet: bottom-edge pacing via nextStep(), a gentle bob,
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
    this.speed = 4;                   // px per frame (fixed default in v1)
    this.size = 90;
    this.theme = opts.theme || 'light';
    this.motivationEnabled = opts.motivationEnabled !== false;
    this._raf = null;
    this._motivationTimer = null;
    this._onClick = () => this._spawnHearts();
    this.petEl.addEventListener('click', this._onClick);
  }

  setPet(species, variant) {
    this.petEl.style.background = 'transparent';
    this.petEl.src = `${this.assetBase}/${species}-${variant}.png`;
  }

  setTheme(theme) { this.theme = theme; }
  setMotivation(enabled) {
    this.motivationEnabled = enabled;
    if (enabled) this._scheduleMotivation();
    else if (this._motivationTimer) { clearTimeout(this._motivationTimer); this._motivationTimer = null; }
  }

  start() {
    if (this.state === 'walking') return;
    this.state = 'walking';
    this._loop();
    if (this.motivationEnabled) this._scheduleMotivation();
  }

  stop() {
    this.state = 'paused';
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._motivationTimer) { clearTimeout(this._motivationTimer); this._motivationTimer = null; }
  }

  _loop() {
    const max = Math.max(0, window.innerWidth - this.size);
    const step = window.nextStep({ x: this.x, dir: this.dir, min: 0, max, speed: this.speed });
    this.x = step.x;
    this.dir = step.dir;
    this.petEl.style.left = `${this.x}px`;
    this.petEl.style.transform = `scaleX(${this.dir === 1 ? 1 : -1})`;
    if (this.state === 'walking') this._raf = requestAnimationFrame(() => this._loop());
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
    const MESSAGES = [
      "You're doing great! 🌟", "Take a deep breath. You got this!",
      "Stay hydrated! 💧", "Small steps, big progress.",
      "One task at a time. ✨", "Be kind to yourself today.",
      "Progress over perfection.", "You make the day brighter 🌈"
    ];
    const FIRST = 30 * 1000, MIN = 2 * 60 * 1000, MAX = 5 * 60 * 1000, VISIBLE = 5000;
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
