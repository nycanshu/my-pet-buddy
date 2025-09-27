# How to Add New Pets - Simple Guide

## 🎯 **Quick Start**

To add a new pet, simply add it to the `PETS` object in `pets.js`:

```javascript
// In pets.js, add your new pet:
rabbit: {
    name: 'Rabbit',
    emoji: '🐰',
    color: '#FFB6C1',
    size: { width: 25, height: 20 },
    animations: {
        walk: 'rabbit-hop',
        tail: 'rabbit-tail',
        legs: 'rabbit-legs'
    },
    html: () => `
        <div class="rabbit-body"></div>
        <div class="rabbit-head">
            <div class="rabbit-ear rabbit-ear-left"></div>
            <div class="rabbit-ear rabbit-ear-right"></div>
            <div class="rabbit-eye rabbit-eye-left"></div>
            <div class="rabbit-eye rabbit-eye-right"></div>
            <div class="rabbit-nose"></div>
        </div>
        <div class="rabbit-tail"></div>
        <div class="rabbit-leg rabbit-leg-front-left"></div>
        <div class="rabbit-leg rabbit-leg-front-right"></div>
        <div class="rabbit-leg rabbit-leg-back-left"></div>
        <div class="rabbit-leg rabbit-leg-back-right"></div>
    `,
    css: () => `
        @keyframes rabbit-hop {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
        }

        .my-pet-rabbit .rabbit-body {
            position: absolute;
            width: 25px;
            height: 20px;
            background: #FFB6C1;
            border-radius: 12px;
            top: 25px;
            left: 17px;
            animation: rabbit-hop 0.5s ease-in-out infinite;
        }

        .my-pet-rabbit .rabbit-head {
            position: absolute;
            width: 18px;
            height: 16px;
            background: #FFB6C1;
            border-radius: 50%;
            top: 15px;
            left: 21px;
            animation: rabbit-hop 0.5s ease-in-out infinite;
        }

        .my-pet-rabbit .rabbit-ear {
            position: absolute;
            width: 4px;
            height: 12px;
            background: #FFB6C1;
            border-radius: 50%;
            top: -3px;
        }

        .my-pet-rabbit .rabbit-ear-left {
            left: 3px;
            transform: rotate(-15deg);
        }

        .my-pet-rabbit .rabbit-ear-right {
            right: 3px;
            transform: rotate(15deg);
        }

        .my-pet-rabbit .rabbit-eye {
            position: absolute;
            width: 2px;
            height: 2px;
            background: #000;
            border-radius: 50%;
            top: 6px;
        }

        .my-pet-rabbit .rabbit-eye-left {
            left: 4px;
        }

        .my-pet-rabbit .rabbit-eye-right {
            right: 4px;
        }

        .my-pet-rabbit .rabbit-nose {
            position: absolute;
            width: 2px;
            height: 1px;
            background: #FF69B4;
            border-radius: 50%;
            top: 8px;
            left: 8px;
        }

        .my-pet-rabbit .rabbit-tail {
            position: absolute;
            width: 8px;
            height: 6px;
            background: #FFB6C1;
            border-radius: 50%;
            top: 30px;
            left: 0px;
            animation: tail-wag 1s ease-in-out infinite;
        }

        .my-pet-rabbit .rabbit-leg {
            position: absolute;
            width: 3px;
            height: 6px;
            background: #FFB6C1;
            border-radius: 2px;
            animation: leg-walk 0.5s ease-in-out infinite;
        }

        .my-pet-rabbit .rabbit-leg-front-left {
            top: 40px;
            left: 20px;
            animation-delay: 0s;
        }

        .my-pet-rabbit .rabbit-leg-front-right {
            top: 40px;
            left: 30px;
            animation-delay: 0.1s;
        }

        .my-pet-rabbit .rabbit-leg-back-left {
            top: 40px;
            left: 35px;
            animation-delay: 0.2s;
        }

        .my-pet-rabbit .rabbit-leg-back-right {
            top: 40px;
            left: 45px;
            animation-delay: 0.3s;
        }
    `
}
```

## 📋 **Pet Definition Structure**

Each pet needs these properties:

```javascript
petName: {
    name: 'Display Name',        // What users see
    emoji: '🐰',                // Emoji for popup
    color: '#FFB6C1',           // Main color
    size: { width: 25, height: 20 }, // Pet dimensions
    animations: {               // Animation names
        walk: 'rabbit-hop',
        tail: 'rabbit-tail',
        legs: 'rabbit-legs'
    },
    html: () => `...`,          // HTML structure
    css: () => `...`            // CSS styles
}
```

## 🎨 **CSS Animation Patterns**

### **Walking Animation:**
```css
@keyframes pet-walk {
    0%, 100% { transform: translateY(0px); }
    25% { transform: translateY(-2px); }
    50% { transform: translateY(0px); }
    75% { transform: translateY(-1px); }
}
```

### **Tail Animation:**
```css
@keyframes tail-wag {
    0%, 100% { transform: rotate(-10deg); }
    50% { transform: rotate(10deg); }
}
```

### **Leg Animation:**
```css
@keyframes leg-walk {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-15deg); }
    50% { transform: rotate(0deg); }
    75% { transform: rotate(15deg); }
}
```

## 🛠️ **Step-by-Step Process**

1. **Choose a pet name** (e.g., `rabbit`, `bird`, `fish`)
2. **Add to PETS object** in `pets.js`
3. **Design the HTML structure** (body, head, features)
4. **Create CSS styles** with animations
5. **Test the pet** by reloading the extension

## 🎯 **Pro Tips**

- **Use consistent naming**: `.my-pet-{petname} .{petname}-{part}`
- **Keep animations smooth**: Use `ease-in-out` timing
- **Stagger leg animations**: Different `animation-delay` values
- **Test on different speeds**: Make sure animations work at all speeds
- **Use relative positioning**: For responsive design

## 🚀 **Example: Adding a Fish**

```javascript
fish: {
    name: 'Fish',
    emoji: '🐠',
    color: '#FF6347',
    size: { width: 30, height: 15 },
    animations: {
        walk: 'fish-swim',
        tail: 'fish-tail',
        legs: 'fish-fins'
    },
    html: () => `
        <div class="fish-body"></div>
        <div class="fish-tail"></div>
        <div class="fish-fin fish-fin-top"></div>
        <div class="fish-fin fish-fin-bottom"></div>
        <div class="fish-eye"></div>
    `,
    css: () => `
        @keyframes fish-swim {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-2px) rotate(2deg); }
        }

        .my-pet-fish .fish-body {
            position: absolute;
            width: 30px;
            height: 15px;
            background: #FF6347;
            border-radius: 50%;
            top: 25px;
            left: 15px;
            animation: fish-swim 0.8s ease-in-out infinite;
        }

        .my-pet-fish .fish-tail {
            position: absolute;
            width: 12px;
            height: 8px;
            background: #FF6347;
            border-radius: 50%;
            top: 26px;
            left: 0px;
            animation: tail-wag 0.6s ease-in-out infinite;
        }

        .my-pet-fish .fish-fin {
            position: absolute;
            width: 6px;
            height: 4px;
            background: #FF6347;
            border-radius: 50%;
        }

        .my-pet-fish .fish-fin-top {
            top: 20px;
            left: 20px;
        }

        .my-pet-fish .fish-fin-bottom {
            top: 35px;
            left: 20px;
        }

        .my-pet-fish .fish-eye {
            position: absolute;
            width: 3px;
            height: 3px;
            background: #000;
            border-radius: 50%;
            top: 28px;
            left: 25px;
        }
    `
}
```

## ✅ **Testing Your New Pet**

1. **Add the pet** to `pets.js`
2. **Reload the extension** in Chrome
3. **Select your new pet** in the popup
4. **Check the animation** on any webpage
5. **Test hover effects** and positioning

That's it! Your new pet will automatically work with all existing features! 🎉
