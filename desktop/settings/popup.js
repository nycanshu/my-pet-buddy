// My Pet Buddy - Settings (Desktop) Logic
// Reused from the extension popup and rewired to the desktop v1 settings schema
// via the chrome.storage.sync shim in popup.html (which routes to the IPC store).
//
// v1 schema keys used here:
//   enabled (bool), species (cat|dog|rabbit|hamster|bird),
//   variant (1..6), theme (system|light|dark), motivationEnabled (bool)

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const toggle = document.getElementById('my-pet-toggle');
    const motivationToggle = document.getElementById('my-pet-motivation-toggle');
    const catGrid = document.getElementById('my-pet-cat-grid');
    const websiteLink = document.getElementById('website-link');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');

    // Apply a theme to the popup body and update the icon to reflect the
    // *next* state (moon = currently light, click to go dark; sun = vice versa)
    function applyTheme(theme) {
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${theme}`);
        themeToggleIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        themeToggleBtn.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }

    // Initial theme: stored preference, else fall back to OS.
    // v1 theme may be 'system' | 'light' | 'dark'; treat anything but an
    // explicit light/dark as "follow OS".
    chrome.storage.sync.get(['theme'], function(result) {
        const stored = result['theme'];
        if (stored === 'dark' || stored === 'light') {
            applyTheme(stored);
        } else {
            const prefersDark = globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
        }
    });

    themeToggleBtn.addEventListener('click', function() {
        const isDark = document.body.classList.contains('theme-dark');
        const next = isDark ? 'light' : 'dark';
        applyTheme(next);
        chrome.storage.sync.set({ 'theme': next });
    });

    let selectedSpecies = 'cat'; // Default species
    let selectedVariant = 1;     // Default variant
    let availablePets = [];      // Will store detected pets

    // Convenience: the currently selected pet id, e.g. "cat-1".
    function selectedPetId() {
        return `${selectedSpecies}-${selectedVariant}`;
    }

    // Set website link (will be updated when GitHub Pages is enabled)
    if (websiteLink) {
        websiteLink.href = 'https://nycanshu.github.io/my-pet-buddy';
    }

    // Update logo source to use the copied assets folder
    const logoImg = document.querySelector('.my-pet-title img');
    if (logoImg) {
        logoImg.src = chrome.runtime.getURL('/logo.png');
    }

    // Pet types configuration - Add new pet types here
    const PET_TYPES = ['cat', 'dog', 'bird', 'rabbit', 'hamster'];
    const MAX_PETS_PER_TYPE = 10; // Maximum pets per type

    // Auto-detect and load pet images
    detectAndLoadPets();

    // Load saved selections on popup open
    loadSavedSelections();

    // Auto-detect available pet images
    function detectAndLoadPets() {
        availablePets = [];
        let promises = [];

        // Check for each pet type
        PET_TYPES.forEach(petType => {
            for (let i = 1; i <= MAX_PETS_PER_TYPE; i++) {
                const petId = `${petType}-${i}`;
                const imagePath = `pets/${petId}.png`;

                // Create a promise for each image check
                const checkPromise = new Promise((resolve) => {
                    const testImg = new Image();
                    testImg.onload = function() {
                        availablePets.push({
                            id: petId,
                            type: petType,
                            name: `${petType.charAt(0).toUpperCase() + petType.slice(1)} ${i}`,
                            imagePath: imagePath
                        });
                        resolve();
                    };
                    testImg.onerror = function() {
                        resolve(); // Image doesn't exist, continue
                    };
                    testImg.src = chrome.runtime.getURL(imagePath);
                });
                promises.push(checkPromise);
            }
        });

        // Wait for all checks to complete, then render
        Promise.all(promises).then(() => {
            // If no pets found, add default cats
            if (availablePets.length === 0) {
                for (let i = 1; i <= 4; i++) {
                    availablePets.push({
                        id: `cat-${i}`,
                        type: 'cat',
                        name: `Cat ${i}`,
                        imagePath: `pets/cat-${i}.png`
                    });
                }
            }
            renderPetGrid();
        });
    }

    // Render the pet grid dynamically with grouping (single-select)
    function renderPetGrid() {
        catGrid.innerHTML = '';

        if (availablePets.length === 0) {
            return;
        }

        // Group pets by type
        const groupedPets = {};
        availablePets.forEach(pet => {
            if (!groupedPets[pet.type]) {
                groupedPets[pet.type] = [];
            }
            groupedPets[pet.type].push(pet);
        });

        // Render each pet type group
        Object.keys(groupedPets).forEach(petType => {
            const pets = groupedPets[petType];

            // Sort pets by their ID to ensure proper order (cat-1, cat-2, etc.)
            pets.sort((a, b) => {
                const aNum = parseInt(a.id.split('-')[1]) || 0;
                const bNum = parseInt(b.id.split('-')[1]) || 0;
                return aNum - bNum;
            });

            // Create group header
            const groupHeader = document.createElement('div');
            groupHeader.className = 'my-pet-group-header';
            groupHeader.textContent = `${petType.charAt(0).toUpperCase() + petType.slice(1)}s`;
            catGrid.appendChild(groupHeader);

            // Create group container
            const groupContainer = document.createElement('div');
            groupContainer.className = 'my-pet-group';

            pets.forEach(pet => {
                const petItem = document.createElement('div');
                petItem.className = 'my-pet-cat-item';
                petItem.dataset.cat = pet.id;

                // Add selected class if this is the saved selection
                if (pet.id === selectedPetId()) {
                    petItem.classList.add('selected');
                }

                petItem.innerHTML = `
                    <img src="${chrome.runtime.getURL(pet.imagePath)}" alt="${pet.name}" class="my-pet-cat-image">
                    <div class="my-pet-cat-name">${pet.name}</div>
                `;

                // Add click handler (single-select: pick one species + variant)
                petItem.addEventListener('click', function() {
                    // Remove selected class from all items
                    document.querySelectorAll('.my-pet-cat-item').forEach(cat => cat.classList.remove('selected'));
                    // Add selected class to clicked item
                    this.classList.add('selected');
                    const [species, variant] = this.dataset.cat.split('-');
                    selectedSpecies = species;
                    selectedVariant = parseInt(variant, 10) || 1;
                    saveSelections();
                });

                groupContainer.appendChild(petItem);
            });

            catGrid.appendChild(groupContainer);
        });
    }

    // Enable/disable toggle handler
    toggle.addEventListener('click', function() {
        this.classList.toggle('active');
        saveSelections();
    });

    // Motivational messages toggle handler
    motivationToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        saveSelections();
    });

    // Load saved selections from storage (v1 schema keys)
    function loadSavedSelections() {
        chrome.storage.sync.get(['enabled', 'species', 'variant', 'motivationEnabled'], function(result) {
            const isEnabled = result['enabled'] || false;
            const species = result['species'] || 'cat';
            const variant = result['variant'] || 1;
            const motivationEnabled = result['motivationEnabled'] || false;

            // Set enable toggle state
            if (isEnabled) {
                toggle.classList.add('active');
            } else {
                toggle.classList.remove('active');
            }

            // Set motivation toggle state
            if (motivationEnabled) {
                motivationToggle.classList.add('active');
            } else {
                motivationToggle.classList.remove('active');
            }

            // Set selected pet (reconstruct id; applied when grid is rendered)
            selectedSpecies = species;
            selectedVariant = variant;
            applySavedSelection();
        });
    }

    // Apply saved selection to rendered grid
    function applySavedSelection() {
        const petId = selectedPetId();
        const catItems = document.querySelectorAll('.my-pet-cat-item');
        catItems.forEach(item => {
            if (item.dataset.cat === petId) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Save current selections to storage (v1 schema keys).
    // Window stays open so the user can keep tweaking; the overlay's
    // settings:changed listener picks up changes live.
    function saveSelections() {
        const isEnabled = toggle.classList.contains('active');
        const motivationEnabled = motivationToggle.classList.contains('active');

        chrome.storage.sync.set({
            'enabled': isEnabled,
            'species': selectedSpecies,
            'variant': selectedVariant,
            'motivationEnabled': motivationEnabled
        });
    }


});
