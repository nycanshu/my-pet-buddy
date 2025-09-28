# Contributing to My Pet Buddy 🐾

Thank you for your interest in contributing to My Pet Buddy! This guide will help you understand how to contribute to this project effectively.

## 🚀 Getting Started

### Prerequisites
- Basic knowledge of HTML, CSS, and JavaScript
- Chrome browser for testing
- Git installed on your system
- Image editing software (for pet images)

### Setting Up Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/nycanshu/my-pet-buddy.git
   cd my-pet-buddy
   ```
3. **Load the extension** in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the project folder
   - Test the extension to ensure it works

## 🐾 Adding New Pets

### Rules for Adding New Pets

#### 1. **Image Requirements**
- **Format**: PNG only (no JPG, GIF, or other formats)
- **Background**: Must have transparent background (remove background for consistency)
- **Quality**: High resolution, clear, and well-cropped
- **Style**: Consistent with existing pets (cute, friendly, animated-style)

#### 2. **Naming Convention**
- **Existing pet groups**: `<pet-group>-<count>.png`
  - Examples: `cat-7.png`, `dog-8.png`, `bird-7.png`
- **New pet groups**: Follow the same pattern
  - Examples: `fish-1.png`, `turtle-1.png`, `penguin-1.png`

#### 3. **File Structure**
```
pets/
├── cat-1.png through cat-6.png
├── dog-1.png through dog-6.png
├── bird-1.png through bird-6.png
├── hamster-1.png through hamster-6.png
├── rabbit-1.png through rabbit-6.png
└── [your-new-pet]-1.png
```

#### 4. **Code Updates Required**

**For existing pet groups:**
- No code changes needed (automatically detected)

**For new pet groups:**
- Update `PET_TYPES` in `popup.js`:
  ```javascript
  const PET_TYPES = [
      'cat', 'dog', 'bird', 'hamster', 'rabbit',
      'your-new-pet-group'  // Add your new pet group here
  ];
  ```

### Step-by-Step Guide

1. **Prepare your pet image**:
   - Create/edit your pet image
   - Remove background (make it transparent)
   - Save as PNG format
   - Name it according to the convention

2. **Add the image**:
   - Place the PNG file in the `pets/` folder
   - Follow the naming convention exactly

3. **Update code (if new pet group)**:
   - Open `popup.js`
   - Find the `PET_TYPES` array
   - Add your new pet group name

4. **Test locally**:
   - Reload the extension in Chrome
   - Test that your new pet appears in the popup
   - Verify the pet displays correctly on websites
   - Check that animations work properly

5. **Update documentation**:
   - If adding a new pet group, update this CONTRIBUTING.md
   - Update README.md if needed

## 🧪 Testing Your Changes

### Local Testing Checklist

- [ ] Extension loads without errors
- [ ] New pet appears in the popup menu
- [ ] Pet displays correctly on different websites
- [ ] Animations work smoothly
- [ ] No console errors in browser developer tools
- [ ] All existing functionality still works

### Testing Steps

1. **Load the extension**:
   ```bash
   # In Chrome: chrome://extensions/
   # Enable Developer mode
   # Click "Load unpacked" and select your project folder
   ```

2. **Test the popup**:
   - Click the extension icon
   - Verify your new pet appears in the list
   - Select your new pet and test functionality

3. **Test on websites**:
   - Visit different websites (Google, GitHub, etc.)
   - Verify your pet appears and animates correctly
   - Test different pet positions (top, middle, bottom)

4. **Check for errors**:
   - Open browser developer tools (F12)
   - Look for any JavaScript errors
   - Test in both light and dark mode websites

## 📝 Submitting Your Contribution

### Before Submitting

- [ ] Test all changes locally
- [ ] Ensure no errors in browser console
- [ ] Follow naming conventions exactly
- [ ] Update code if adding new pet groups
- [ ] Verify image quality and transparency

### Pull Request Process

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/add-new-pets
   ```

2. **Commit your changes**:
   ```bash
   git add pets/your-new-pet.png
   git add popup.js  # if you modified it
   git commit -m "Add new pet: [pet-name]"
   ```

3. **Push to your fork**:
   ```bash
   git push origin feature/add-new-pets
   ```

4. **Create a Pull Request**:
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill out the PR template (if available)
   - Include screenshots of your new pet in action

### Pull Request Guidelines

**Title Format**: `Add new pet: [pet-name]` or `Add new feature [feature-name]`

**Description should include**:
- What pet(s) you added
- Any code changes made
- Screenshots of the new pet in action
- Confirmation that you tested locally

**Example PR Description**:
```markdown
## Added New Pet: Golden Retriever

### Changes Made:
- Added `dog-7.png` (Golden Retriever) to pets folder
- Image has transparent background and follows naming convention
- Tested locally and verified it works correctly

### Screenshots:
[Include screenshots of the new pet in the popup and on websites]

### Testing:
- ✅ Extension loads without errors
- ✅ New pet appears in popup
- ✅ Pet displays correctly on test websites
- ✅ Animations work smoothly
```

## 🔍 Review Process

### What We Look For

1. **Image Quality**:
   - High resolution and clear
   - Transparent background
   - Consistent style with existing pets
   - Proper naming convention

2. **Code Quality**:
   - Follows existing code patterns
   - No unnecessary changes
   - Proper variable naming
   - Clean, readable code

3. **Testing**:
   - Thoroughly tested locally
   - No errors or issues
   - Works across different websites
   - Maintains existing functionality

### Review Timeline

- **Initial Review**: Within 2-3 business days
- **Feedback**: We'll provide feedback if changes are needed
- **Approval**: Once approved, your PR will be merged
- **Release**: New pets will be included in the next extension update

## 🚫 What Not to Contribute

### Please Avoid:
- Low-quality or blurry images
- Images with backgrounds (must be transparent)
- Inappropriate or offensive content
- Non-pet related images
- Breaking existing functionality
- Unnecessary code changes

### Image Guidelines:
- ❌ No JPG or GIF formats
- ❌ No images with solid backgrounds
- ❌ No low-resolution images
- ❌ No copyrighted or trademarked characters
- ✅ PNG format only
- ✅ Transparent background
- ✅ High quality and clear
- ✅ Original or properly licensed content

## 🆘 Getting Help

### Need Assistance?

- **Issues**: Create a GitHub issue for questions
- **Discussions**: Use GitHub Discussions for general questions
- **Email**: Contact the maintainer for urgent issues

### Common Issues

**Pet not appearing**:
- Check file naming convention
- Verify PNG format
- Ensure transparent background
- Check browser console for errors

**Extension not loading**:
- Verify all files are in correct locations
- Check for syntax errors in JavaScript
- Ensure manifest.json is valid

**Animations not working**:
- Test on different websites
- Check if content script is loading
- Verify pet selection is working

## 📋 Contribution Checklist

Before submitting your PR, ensure:

- [ ] Pet image follows naming convention
- [ ] Image has transparent background
- [ ] Image is high quality and clear
- [ ] Code updated if adding new pet group
- [ ] Tested locally and works correctly
- [ ] No errors in browser console
- [ ] PR description is complete
- [ ] Screenshots included (if applicable)

## 🎉 Thank You!

Your contributions help make My Pet Buddy better for everyone! We appreciate your time and effort in contributing to this project.

---

**Happy Contributing! 🐾✨**
