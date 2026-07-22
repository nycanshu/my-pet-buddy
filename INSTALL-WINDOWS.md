# Installing My Pet Buddy on Windows 🐾

A friendly, step-by-step guide to installing **My Pet Buddy — Desktop Edition** on Windows.
It takes about a minute.

> **Requirements:** Windows 10 or 11 (64-bit). Also runs on Windows on ARM via emulation.

---

## 1. Download

Download the installer: **`MyPetBuddy-Setup-<version>.exe`**
(from whoever shared it with you, or from the [Releases page](https://github.com/nycanshu/my-pet-buddy/releases)).

---

## 2. "Windows protected your PC" — this is normal ✋

When you run the installer, Windows may show a blue **"Windows protected your PC"** box.

This appears because the app isn't code-signed yet (a paid certificate we haven't added) — **not** because anything is wrong. To continue:

1. Click **More info**
2. Click **Run anyway**

That's it — the wizard opens.

---

## 3. The setup wizard (step by step)

| Screen | What to do |
|--------|-----------|
| **1. Choose who to install for** | Pick **"Only for me"** (no admin needed) or **"Anyone who uses this computer"** (asks for an admin password). *Only for me* is easiest. |
| **2. License Agreement** | Read the MIT license, choose **I accept**, click **Next**. |
| **3. Install location** | Keep the default folder, or **Browse** to change it → **Next**. |
| **4. Installing** | A progress bar runs for a few seconds. |
| **5. Finish** | Leave **"Run My Pet Buddy"** checked → **Finish**. |

A **Desktop shortcut** and a **Start Menu** entry are created automatically.

---

## 4. First launch — where's the pet? 👀

- A cute pet starts **walking along the bottom of your screen**, over your other apps.
- **There is no app window** — that's by design. The app lives in your **system tray** (bottom-right of the taskbar, near the clock). The tray icon *is* your pet.
- If you don't see the tray icon, click the small **▲ (show hidden icons)** arrow near the clock — Windows often hides new tray icons there. You can drag it out to keep it visible.

### Using it
- **Left-click** the tray icon → opens the little settings popover (choose your pet, position, motion, theme, etc.).
- **Right-click** the tray icon → quick menu: **Show/Hide Pet**, **Settings**, **Launch at Login**, **Quit**.
- **Click the pet** on screen → floating hearts 💕.

---

## 5. Uninstalling

Two easy ways:
- **Settings → Apps → Installed apps → My Pet Buddy → Uninstall**, or
- **Start Menu → My Pet Buddy → Uninstall**

Your preferences are kept by default in case you reinstall.

---

## 6. Troubleshooting

| Problem | Fix |
|--------|-----|
| "I ran it but nothing happened" | It's running! Look in the **system tray** (bottom-right, under the ▲ arrow). No window is expected. |
| Can't get past the SmartScreen box | Click **More info → Run anyway** (see step 2). It's safe — just unsigned. |
| Tray icon is hidden | Click the **▲** near the clock; drag the pet icon onto the taskbar to pin it. |
| The pet won't come back after "Hide Pet" | Right-click the tray icon → **Show Pet**. |
| It won't start a second copy | Only one instance runs at a time — that's intentional. |

---

## 🤝 Contributions are welcome!

My Pet Buddy is **open source (MIT)** and contributions are very welcome — new pets, features, bug fixes, or docs. See **[CONTRIBUTING.md](CONTRIBUTING.md)** to get started (adding a new pet is a one-file change!). Found a bug or have an idea? [Open an issue](https://github.com/nycanshu/my-pet-buddy/issues).

Made with ❤️ — enjoy your desktop buddy!
