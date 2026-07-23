# My Pet Buddy 🐾

**A tiny virtual pet that walks across your screen and keeps you company while you work — now on your browser AND your Mac & Windows desktop.** 🎉

Pick your buddy — cat, dog, bunny, hamster, or birdie — click 'em for a burst of hearts, catch a little motivational nudge when you need it, and let them parade around while you grind. No ads. No sign-up. 100% free and open source. Just vibes. 🐱🐶🐰

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-5.0%20⭐-green?style=for-the-badge&logo=google-chrome)](https://chromewebstore.google.com/detail/my-pet-buddy-virtual-pet/fpgcioopagdmanbgjikghomglhmjfnne)
[![Microsoft Edge](https://img.shields.io/badge/Microsoft%20Edge-Add--ons-blue?style=for-the-badge&logo=microsoft-edge)](https://microsoftedge.microsoft.com/addons/detail/my-pet-buddy-virtual-pe/ffpmifppjfofiakekjaakgeiakkophad)
[![Version](https://img.shields.io/badge/Version-1.0-blue?style=for-the-badge)](https://chromewebstore.google.com/detail/my-pet-buddy-virtual-pet/fpgcioopagdmanbgjikghomglhmjfnne)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://github.com/nycanshu/my-pet-buddy/blob/main/LICENSE)

<img width="1920" height="960" alt="file cover - 1" src="https://github.com/user-attachments/assets/425ded76-d3e0-4555-bb9f-22830ec0ebd6" />

## 🖥️ NEW: it broke out of the browser — now on Desktop!

Your buddy doesn't need a browser tab anymore. The **desktop app** puts a pet on your **whole screen**, strolling over every app you've got open (yeah, even while you're buried in VS Code 😏). Same cute pets, now living in your **menu bar (Mac)** / **system tray (Windows)** — click the icon and a little popover pops right out.

| Get it | |
|---|---|
| 🍎 **macOS** | [Download the `.dmg`](https://github.com/nycanshu/my-pet-buddy/releases) |
| 🪟 **Windows** | [Download the installer](https://github.com/nycanshu/my-pet-buddy/releases) · [1-min install guide](INSTALL-WINDOWS.md) |
| 🍺 **Homebrew** | `brew install --cask nycanshu/tap/my-pet-buddy` *(coming soon)* |

Walks over any app · click for hearts 💕 · motivational nudges ✨ · dark mode 🌙 · picks up where it left off. Free forever.

## ✨ Features

- **🎨 Multiple Pet Types**: Choose from cats, dogs, birds, rabbits, and more
- **🖼️ PNG Image Support**: High-quality pet images with smooth animations
- **🎯 Interactive Pets**: Hover over pets to see them pop and play
- **📍 Position Control**: Place pets at bottom, middle, or top of your screen
- **⚡ Lightweight**: Optimized for performance with minimal resource usage
- **💾 Persistent Settings**: Your preferences are saved across browser sessions
- **🎨 Modern UI**: Clean, professional popup interface with consistent design
- **🔧 Easy Customization**: Add new pet types by simply adding images to the pets folder

## 🚀 Quick Start Guide

### 🛒 Install from Browser Stores (Recommended)

**Chrome Users:**
1. **Visit Chrome Web Store**:
   - Click the Chrome badge above or visit: [Chrome Web Store](https://chromewebstore.google.com/detail/my-pet-buddy-virtual-pet/fpgcioopagdmanbgjikghomglhmjfnne)
   - Click "Add to Chrome" button

**Microsoft Edge Users:**
1. **Visit Microsoft Edge Add-ons**:
   - Click the Edge badge above or visit: [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/my-pet-buddy-virtual-pe/ffpmifppjfofiakekjaakgeiakkophad)
   - Click "Get" button

2. **Confirm Installation**:
   - Review permissions and click "Add extension"
   - The extension will be automatically installed and enabled

3. **Start Using**:
   - Click the "My Pet Buddy" icon in your browser toolbar
   - Toggle the extension ON/OFF using the switch at the top
   - Select your preferred pet position (Bottom/Middle/Top)
   - Choose your pet companion from the gallery
   - Navigate to any webpage to see your pets parading!

### 🔧 For Developers (Local Installation)

If you want to contribute or test locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/nycanshu/my-pet-buddy.git
   cd my-pet-buddy
   ```

2. **Load in Browser**:
   - **Chrome**: Navigate to `chrome://extensions/`
   - **Edge**: Navigate to `edge://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked" and select the project folder

3. **Test the Extension**:
   - Follow the same usage steps as above

## 🎮 How to Use

1. **Install**: Get the extension from [Chrome Web Store](https://chromewebstore.google.com/detail/my-pet-buddy-virtual-pet/fpgcioopagdmanbgjikghomglhmjfnne) or [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/my-pet-buddy-virtual-pe/ffpmifppjfofiakekjaakgeiakkophad)
2. **Enable**: Toggle the switch in the popup to activate pets
3. **Choose Position**: Select where you want pets to appear (Bottom/Middle/Top)
4. **Select Your Pet**: Click on any pet from the gallery to choose your companion
5. **Enjoy**: Navigate to any website and watch your pet parade along the screen!
6. **Interact**: Hover over your pet to see it pop and play

## 🐛 Troubleshooting

- **Pets Not Appearing**: Ensure the extension is enabled and a pet is selected
- **Images Not Loading**: Check that images are in the `pets/` folder with correct naming
- **Animation Issues**: Verify that the webpage allows content scripts
- **Storage Issues**: Clear extension data in Chrome settings if needed
- **Performance**: This extension is optimized for minimal resource usage

## 🌐 Browser Compatibility

- **Chrome**: 88+ (Manifest V3 support) - [Install from Chrome Web Store](https://chromewebstore.google.com/detail/my-pet-buddy-virtual-pet/fpgcioopagdmanbgjikghomglhmjfnne)
- **Microsoft Edge**: 88+ (Manifest V3 support) - [Install from Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/my-pet-buddy-virtual-pe/ffpmifppjfofiakekjaakgeiakkophad)
- **Other Chromium-based**: Brave, Opera, etc. (via Chrome Web Store)
- **Firefox**: Not supported (uses Chrome-specific APIs)

## 🖥️ Desktop App (macOS & Windows)

Want your pet to walk across your **whole screen**, over every app — not just web pages? My Pet Buddy also ships as a lightweight desktop app built with Electron.

- 🐾 A pet paces the bottom of your screen, floating over any app (VS Code, browsers, …)
- 💕 Click the pet for floating hearts, plus periodic motivational messages
- 🧭 Lives in the **menu bar** (macOS) / **system tray** (Windows) — no window clutter, no close button
- ⚙️ Pick your pet + theme, settings persist, optional launch-at-login, auto-updates

**Install:** grab the latest `.dmg` (macOS) or `.exe` (Windows) from [Releases](https://github.com/nycanshu/my-pet-buddy/releases). Windows users: see the step-by-step **[Windows install guide](INSTALL-WINDOWS.md)**.

**Develop / build:** see [`desktop/README.md`](desktop/README.md).

### 📋 Contribution Guidelines
see our [CONTRIBUTING.md](CONTRIBUTING.md) file.

## 📄 License

This project is open source and available under the MIT License.

---

## 🎉 Get Started Now!

[![Install from Chrome Web Store](https://img.shields.io/badge/Install%20from-Chrome%20Web%20Store-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/my-pet-buddy-virtual-pet/fpgcioopagdmanbgjikghomglhmjfnne)
[![Install from Microsoft Edge](https://img.shields.io/badge/Install%20from-Microsoft%20Edge-0078D4?style=for-the-badge&logo=microsoft-edge&logoColor=white)](https://microsoftedge.microsoft.com/addons/detail/my-pet-buddy-virtual-pe/ffpmifppjfofiakekjaakgeiakkophad)

**Made with ❤️ for pet lovers and animal enthusiasts!**

*Bring joy to your browsing experience with adorable virtual companions!* 🐾
