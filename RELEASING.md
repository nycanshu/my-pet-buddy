# Releasing My Pet Buddy

This repo ships **two separate products** that release **independently**:

| Product | Lives in | Version source | Ships via |
|---|---|---|---|
| **Browser extension** | repo root (`manifest.json`, `content.js`, `popup.*`) | `manifest.json` → `"version"` | Chrome Web Store + Edge Add-ons |
| **Desktop app** | `desktop/` | `desktop/package.json` → `"version"` | GitHub Releases + auto-update |

They do **not** share a version number, and a release of one must never trigger a
release of the other. The tag convention below is what keeps them separate.

---

## 🏷️ Tag convention (read this first)

**A desktop build/release is triggered by a git tag — the extension is not.**

| To release… | Use a tag like | What happens |
|---|---|---|
| **Desktop app** | `v1.0.5` | CI (`.github/workflows/desktop-release.yml`) builds the `.dmg` + `.exe` and publishes them to a GitHub Release. Auto-update picks it up. |
| **Browser extension** | `ext-v1.2` *(optional record)* | **Nothing automated.** You upload the zip to the Chrome Web Store / Edge dashboard manually. The tag is just a git bookmark. |

**Why this works safely:** the desktop CI only listens for tags matching `v*`.
`v1.0.5` matches → desktop builds. `ext-v1.2` starts with `e`, so it does **not**
match → the extension tag never triggers a desktop build. 🎯

> ⚠️ **Never tag the extension with a `v*` tag** (e.g. `v1.2`). That would kick off
> a desktop build using whatever version is in `desktop/package.json` — a mismatched,
> confusing release. Extension tags always use the `ext-v` prefix.

**Golden rule:** the desktop tag must **equal** `desktop/package.json`'s version.
Tag `v1.0.5` ⇒ `desktop/package.json` says `1.0.5`. electron-updater and the GitHub
Release both key off that number, so they must match exactly.

---

## 🖥️ Desktop release — step by step

From the `desktop/` folder:

1. **Make sure `main` is green and smoke-tested**
   ```bash
   cd desktop
   npm test          # unit tests pass
   npm start         # manual check: pet walks, popover opens, toggle hides/shows
   ```
2. **Bump the version** (single source of truth, no git commit yet)
   ```bash
   npm run bump:patch   # 1.0.4 -> 1.0.5   (or bump:minor / bump:major)
   ```
3. **Update the changelog** — move items from `## [Unreleased]` into a new
   `## [1.0.5] - YYYY-MM-DD` section in `desktop/CHANGELOG.md`.
4. **Commit** the version + changelog bump on `main`:
   ```bash
   git add desktop/package.json desktop/CHANGELOG.md
   git commit -m "chore(desktop): release v1.0.5"
   ```
5. **Tag and push** — this is what triggers the build:
   ```bash
   git tag v1.0.5
   git push && git push --tags
   ```
6. **CI does the rest**: builds the universal `.dmg` + Windows `.exe`, creates the
   GitHub Release `v1.0.5`, and attaches the installers. Auto-update goes live.
7. **Verify**: the Release page has both installers; download + smoke-test one.

**Build locally instead of via CI?**
```bash
npm run dist:all     # builds both .dmg + .exe locally (no publish)
```

### Pre-release / beta (optional, later)
Tag `v1.1.0-beta.1`. With an electron-builder `beta` channel, only opted-in testers
get it. Promote to stable by releasing `v1.1.0`.

---

## 🧩 Browser extension release — step by step

1. Bump `"version"` in `manifest.json` (e.g. `1.1` → `1.2`).
2. Update the extension's "What's New" copy if applicable.
3. Zip the extension files (everything the manifest references) and upload to the
   **Chrome Web Store** and **Edge Add-ons** dashboards. They review it (hours–days).
4. (Optional) mark it in git:
   ```bash
   git tag ext-v1.2 && git push --tags
   ```
   Remember: `ext-v*` does **not** trigger the desktop CI.

---

## 📁 Repo structure & why we keep it this way

```
my-pet-buddy/
├── manifest.json, content.js, popup.*, pets/, index.html   # browser extension + website (GitHub Pages)
├── desktop/                                                 # Electron desktop app (own package.json, own version)
│   └── CHANGELOG.md
├── packaging/homebrew/                                      # Homebrew cask template (parked)
├── .github/workflows/desktop-release.yml                   # desktop CI (triggers on v* tags)
├── CONTRIBUTING.md · LICENSE · README.md · RELEASING.md · INSTALL-WINDOWS.md
```

**Do we need a "packages"/workspaces setup (like big monorepos)?** Not now — and here's why:

- Tools like **npm/pnpm workspaces, Turborepo, Nx, Lerna, Changesets** shine when you
  have **multiple npm packages that depend on each other** and want one command to
  version/build them together.
- Here, the two products **don't import each other** — the extension is plain
  static files (no build step), and the desktop app is self-contained in `desktop/`.
  They only **share the pet art**, which `desktop/scripts/copy-assets.js` copies from
  the root `pets/` at build time. That's the entire "shared dependency."
- **Restructuring into `apps/extension` + `apps/desktop` would be risky right now:**
  the extension is live in the stores and `index.html` is a **published, SEO-ranking
  GitHub Pages site** at the repo root. Moving those files would break store packaging,
  the site's URLs, and its SEO. Not worth it.

**Keep it as-is.** The current layout *is* a clean "monorepo-lite": each product owns
its folder and its version, shared art has one source (`pets/`), and tags namespace
the releases. If the desktop app ever grows its own sub-packages, revisit workspaces
then — but you don't need that overhead today.

---

## ✅ Release checklist (desktop)

- [ ] `npm test` passes
- [ ] `npm start` smoke test OK (walk, popover, position/motion, toggle)
- [ ] `desktop/package.json` version bumped
- [ ] `desktop/CHANGELOG.md` updated (moved from Unreleased)
- [ ] committed on `main`
- [ ] tag `vX.Y.Z` pushed (matches package.json)
- [ ] CI green; Release has both `.dmg` + `.exe`
- [ ] downloaded + smoke-tested one installer
- [ ] _(when signing exists)_ installers signed / notarized
