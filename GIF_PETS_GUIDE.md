# GIF-Based Pets Guide

## 🎯 **Overview**

The extension now supports **GIF-based pets** for much more detailed and professional-looking animations! You can use animated GIFs instead of CSS animations.

## 🚀 **How GIF Pets Work**

### **Structure:**
```javascript
petName: {
    name: 'Pet Name',
    emoji: '🐱',
    type: 'gif', // This indicates it's a GIF-based pet
    gif: {
        walk: 'https://example.com/walking.gif',    // Walking animation
        idle: 'https://example.com/idle.gif',      // Idle animation  
        hover: 'https://example.com/hover.gif'     // Hover animation
    },
    // ... rest of definition
}
```

### **Behavior:**
- **Walking**: Shows `walk` GIF while parading
- **Hover**: Changes to `hover` GIF when you hover over it
- **Resume**: Returns to `walk` GIF when you stop hovering

## 🎨 **Finding Good GIFs**

### **Free GIF Resources:**

1. **Giphy** (https://giphy.com/)
   - Huge collection of animated GIFs
   - Search for "walking cat", "running dog", etc.
   - Right-click → "Copy image address"

2. **Tenor** (https://tenor.com/)
   - Great for animal animations
   - High quality GIFs
   - Easy to find walking animations

3. **OpenGameArt.org**
   - Free game assets
   - Pixel art animations
   - Creative Commons license

4. **Itch.io**
   - Free game assets
   - Various art styles
   - Good for pixel art pets

### **GIF Requirements:**
- **Size**: 60x60px or similar square format
- **Format**: GIF (animated)
- **Content**: Walking/running animation
- **Loop**: Should loop seamlessly
- **Transparent background** (optional but recommended)

## 🛠️ **Adding a GIF Pet**

### **Step 1: Find Your GIFs**
```javascript
// Example: Rabbit pet with GIFs
rabbit: {
    name: 'Rabbit',
    emoji: '🐰',
    color: '#FFB6C1',
    size: { width: 60, height: 60 },
    type: 'gif',
    gif: {
        walk: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif',
        idle: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif',
        hover: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif'
    },
    animations: {
        walk: 'pet-walk',
        hover: 'pet-hover',
        idle: 'pet-idle'
    },
    html: () => `
        <div class="pet-gif-container">
            <img class="pet-gif" src="" alt="Rabbit" />
        </div>
    `,
    css: () => `
        .my-pet-rabbit .pet-gif-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .my-pet-rabbit .pet-gif {
            width: 60px;
            height: 60px;
            object-fit: contain;
            animation: pet-walk 0.5s ease-in-out infinite;
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
        }

        .my-pet-rabbit:hover .pet-gif {
            animation: pet-hover 0.5s ease-in-out infinite;
        }
    `
}
```

### **Step 2: Add to pets.js**
1. Open `pets.js`
2. Add your pet definition to the `PETS` object
3. Save the file

### **Step 3: Test**
1. Reload the extension in Chrome
2. Select your new pet
3. See it in action!

## 🎯 **Pro Tips**

### **GIF Selection:**
- **Walking animations** work best for the main `walk` GIF
- **Idle animations** can be subtle (breathing, blinking)
- **Hover animations** can be excited or playful
- **Same GIF** can be used for all states if needed

### **Performance:**
- **Smaller file sizes** load faster
- **Optimized GIFs** perform better
- **Local files** can be used instead of URLs
- **Caching** helps with repeated loads

### **Customization:**
- **Different sizes** by changing `width` and `height` in CSS
- **Different speeds** by adjusting animation duration
- **Special effects** with CSS filters or transforms

## 📁 **Using Local GIFs**

Instead of URLs, you can use local files:

```javascript
gif: {
    walk: 'pets/rabbit-walk.gif',
    idle: 'pets/rabbit-idle.gif', 
    hover: 'pets/rabbit-hover.gif'
}
```

**Note**: You'll need to add the GIF files to your extension folder and update the manifest if needed.

## 🎨 **Example GIF Pets**

### **Cat with Different States:**
```javascript
cat: {
    name: 'Cat',
    emoji: '🐱',
    type: 'gif',
    gif: {
        walk: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif',
        idle: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif',
        hover: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif'
    },
    // ... rest of definition
}
```

### **Dog with Excited Hover:**
```javascript
dog: {
    name: 'Dog',
    emoji: '🐶',
    type: 'gif',
    gif: {
        walk: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif',
        idle: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif',
        hover: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif' // Excited dog
    },
    // ... rest of definition
}
```

## ✅ **Benefits of GIF Pets**

1. **Professional Quality**: Much more detailed animations
2. **Easy to Add**: Just find GIFs and add URLs
3. **No CSS Knowledge**: No need to create complex animations
4. **Rich Animations**: Can show complex movements and expressions
5. **Easy Customization**: Just swap GIF URLs to change animations

## 🚀 **Next Steps**

1. **Find GIFs** for your favorite animals
2. **Add them** to the `PETS` object in `pets.js`
3. **Test** the extension with your new pets
4. **Customize** sizes and animations as needed

The system automatically handles GIF switching based on user interactions! 🎉
