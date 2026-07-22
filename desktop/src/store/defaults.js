// Single source of truth for settings keys + defaults.
const DEFAULTS = Object.freeze({
  enabled: true,          // pet visible on launch
  species: 'cat',         // cat | dog | rabbit | hamster | bird
  variant: 1,             // 1..6 -> assets/pets/<species>-<variant>.png
  theme: 'system',        // system | light | dark
  launchOnLogin: false,   // default OFF
  motivationEnabled: true,// speech bubbles on/off
  position: 'bottom',     // bottom | middle | top  (vertical placement on screen)
  motionMode: 'parade'    // parade (walks across) | left (sits at left) | right (sits at right)
});

module.exports = { DEFAULTS };
