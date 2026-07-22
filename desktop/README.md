# My Pet Buddy — Desktop Edition 🐾

A cute pet that walks along the bottom of your screen, floating over every app.
Cross-platform (macOS + Windows), built with Electron. Same pets and charm as the
[browser extension](../README.md), now on your desktop.

## Features
- A single pet paces the bottom of your screen, over any app (VS Code, browsers, …)
- Click the pet for floating hearts 💕
- Periodic motivational messages ✨
- Pick your pet (cat, dog, rabbit, hamster, bird) and a light/dark theme
- Lives in the menu-bar (macOS) / system-tray (Windows) — no window clutter
- Optional launch-at-login, settings that persist, auto-updates

## Install
Download the latest `.dmg` (macOS) or `.exe` (Windows) from
[Releases](https://github.com/nycanshu/my-pet-buddy/releases).

> First launch on an unsigned build may show an OS warning ("unidentified
> developer" / SmartScreen). Choose Open / Run anyway. Signed builds land later.

## Develop
```bash
cd desktop
npm install
npm start
```

## Build
```bash
npm run dist:mac   # universal .dmg (on macOS)
npm run dist:win   # .exe (on Windows/CI)
```

MIT licensed — see [LICENSE](../LICENSE).
