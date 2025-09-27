// My Pet Buddy - Popup Logic
// Handles user interactions and storage management
//
// TO ADD MORE PETS:
// 1. Add your pet images to the pets/ folder (e.g., cat-5.png, cat-6.png)
// 2. Update the maxPets value in PET_CONFIG below
// 3. The extension will automatically detect and display them

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const toggle = document.getElementById('my-pet-toggle');
    const catGrid = document.getElementById('my-pet-cat-grid');
    const positionButtons = document.querySelectorAll('.my-pet-position-btn');
    
    let selectedCat = 'cat-1'; // Default selection
    let selectedPosition = 0; // Default position (bottom)
    let availablePets = []; // Will store detected pets

    // Pet types configuration - Add new pet types here
    const PET_TYPES = ['cat', 'dog', 'bird', 'rabbit', 'hamster'];
    const MAX_PETS_PER_TYPE = 10; // Maximum pets per type
    const DEFAULT_SPEED = 30; // Default speed in seconds

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
                // console.log('No pets found, adding default cats');
                for (let i = 1; i <= 4; i++) {
                    availablePets.push({
                        id: `cat-${i}`,
                        type: 'cat',
                        name: `Cat ${i}`,
                        imagePath: `pets/cat-${i}.png`
                    });
                }
            }
            // console.log('Available pets:', availablePets);
            renderPetGrid();
        });
    }
    
    // Render the pet grid dynamically with grouping
    function renderPetGrid() {
        // console.log('Rendering pet grid with', availablePets.length, 'pets');
        catGrid.innerHTML = '';
        
        if (availablePets.length === 0) {
            // console.log('No pets to render');
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
        
        // console.log('Grouped pets:', groupedPets);
        
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
                if (pet.id === selectedCat) {
                    petItem.classList.add('selected');
                }
                
                petItem.innerHTML = `
                    <img src="${chrome.runtime.getURL(pet.imagePath)}" alt="${pet.name}" class="my-pet-cat-image">
                    <div class="my-pet-cat-name">${pet.name}</div>
                `;
                
                // Add click handler
                petItem.addEventListener('click', function() {
                    // Remove selected class from all items
                    document.querySelectorAll('.my-pet-cat-item').forEach(cat => cat.classList.remove('selected'));
                    // Add selected class to clicked item
                    this.classList.add('selected');
                    selectedCat = this.dataset.cat;
                    saveSelections();
                });
                
                groupContainer.appendChild(petItem);
            });
            
            catGrid.appendChild(groupContainer);
        });
    }

    // Add click handlers for position buttons
    positionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            positionButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            selectedPosition = parseInt(this.dataset.position);
            saveSelections();
        });
    });

    // Toggle handler
    toggle.addEventListener('click', function() {
        this.classList.toggle('active');
        saveSelections();
    });

    // Load saved pet selections from storage
    function loadSavedSelections() {
        chrome.storage.sync.get(['my-pet-selections', 'my-pet-enabled', 'my-pet-y-position', 'my-pet-selected-cat'], function(result) {
            const selections = result['my-pet-selections'] || [];
            const isEnabled = result['my-pet-enabled'] || false;
            const yPosition = result['my-pet-y-position'] || 0;
            const savedCat = result['my-pet-selected-cat'] || 'cat-1';

            // Set toggle state
            if (isEnabled && selections.includes('cat')) {
                toggle.classList.add('active');
            } else {
                toggle.classList.remove('active');
            }

            // Set selected cat (will be applied when grid is rendered)
            selectedCat = savedCat;

            // Set position
            selectedPosition = yPosition;
            positionButtons.forEach(button => {
                if (parseInt(button.dataset.position) === yPosition) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
        });
    }
    
    // Apply saved selection to rendered grid
    function applySavedSelection() {
        const catItems = document.querySelectorAll('.my-pet-cat-item');
        catItems.forEach(item => {
            if (item.dataset.cat === selectedCat) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Save selected pets to storage
    function saveSelections() {
        const isEnabled = toggle.classList.contains('active');
        const selections = isEnabled ? ['cat'] : [];

        // Save to storage
        chrome.storage.sync.set({
            'my-pet-selections': selections,
            'my-pet-enabled': isEnabled,
            'my-pet-y-position': selectedPosition,
            'my-pet-speed': DEFAULT_SPEED,
            'my-pet-selected-cat': selectedCat
        }, function() {
            // Close popup after short delay
            setTimeout(() => {
                window.close();
            }, 300);
        });
    }


});
