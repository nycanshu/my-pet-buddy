# My Pet Buddy - Chrome Extension

A lightweight Chrome extension that allows you to select up to two pets (cat 🐱 and dog 🐶) that will parade along the bottom edge of your browser window. Pets perform a playful jump animation when you hover over them.

## Features

- **Lightweight**: Under 50KB total size, no external dependencies
- **Modern UI**: Clean, minimalist popup interface with flexbox layout
- **Pet Selection**: Choose up to 2 pets from cat and dog options
- **Animated Parade**: Pets smoothly parade from left to right across the bottom
- **Interactive**: Hover over pets to see them jump with a bounce animation
- **Persistent**: Selections saved across browser sessions
- **Non-intrusive**: Pets don't interfere with webpage interactions

## Installation & Testing

### Load as Unpacked Extension

1. **Open Chrome Extensions Page**:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)

2. **Load the Extension**:
   - Click "Load unpacked"
   - Select the `my-pet-buddy` folder containing the extension files
   - The extension should appear in your extensions list

3. **Test the Extension**:
   - Click the extension icon in the toolbar
   - Select one or two pets using the checkboxes
   - Click "Save & Activate"
   - Navigate to any webpage to see your pets parading
   - Hover over pets to see them jump

### File Structure

```
my-pet-buddy/
├── manifest.json      # Extension configuration (Manifest V3)
├── popup.html         # Extension popup interface
├── popup.js           # Popup logic and storage management
├── content.js         # Pet animations and webpage integration
└── README.md          # This file
```

## Usage

1. **Select Pets**: Open the extension popup and check the pets you want (Cat 🐱 and/or Dog 🐶)
2. **Activate**: Click "Save & Activate" to start the parade
3. **Interact**: Hover over any pet to see it jump with a bounce animation
4. **Disable**: Click "Disable Pets" to stop the parade

## Technical Details

- **Manifest Version**: V3 (latest Chrome extension standard)
- **Permissions**: `storage` (for saving selections), `activeTab` (for content injection)
- **Animations**: CSS keyframes for smooth 60fps performance
- **Storage**: Chrome Storage API for persistence across sessions
- **Performance**: GPU-accelerated transforms, lightweight emoji-based pets
- **Compatibility**: Works on all websites without breaking layouts

## Customization

The extension is designed to be easily extensible:

- **Add More Pets**: Modify the pet options in `popup.html` and `popup.js`
- **Change Animations**: Update the CSS keyframes in `content.js`
- **Styling**: Modify the CSS in `popup.html` for different visual themes
- **Pet Limit**: Adjust the maximum pet selection limit in `popup.js`

## Troubleshooting

- **Pets Not Appearing**: Ensure the extension is enabled and pets are selected
- **Animation Issues**: Check that the webpage allows content scripts
- **Storage Issues**: Clear extension data in Chrome settings if needed
- **Performance**: The extension is optimized for minimal resource usage

## Browser Compatibility

- Chrome 88+ (Manifest V3 support)
- Chromium-based browsers (Edge, Brave, etc.)

---

**Note**: This extension uses only vanilla HTML, CSS, and JavaScript with no external libraries to maintain its lightweight nature.
