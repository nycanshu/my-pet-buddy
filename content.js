// My Pet Buddy - Content Script
// Handles pet animations and webpage integration

(function() {
    'use strict';

    // Prevent multiple instances
    if (window.myPetBuddyLoaded) {
        return;
    }
    window.myPetBuddyLoaded = true;

    // Get pet selections and enabled status from storage
    chrome.storage.sync.get(['my-pet-selections', 'my-pet-enabled', 'my-pet-y-position', 'my-pet-speed', 'my-pet-selected-cat'], function(result) {
        const selections = result['my-pet-selections'] || [];
        const isEnabled = result['my-pet-enabled'] || false;
        const yPosition = result['my-pet-y-position'] || 0;
        const speed = result['my-pet-speed'] || 10;
        const selectedCat = result['my-pet-selected-cat'] || 'cat-1';

        if (isEnabled && selections.length > 0) {
            createPetParade(selections, yPosition, speed, selectedCat);
        }
    });

    // Create the pet parade container and pets
    function createPetParade(selections, yPosition, speed, selectedCat) {
        // Remove existing pets if any
        const existingContainer = document.getElementById('my-pet-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        // Create main container
        const container = document.createElement('div');
        container.id = 'my-pet-container';
        container.style.cssText = `
            position: fixed;
            bottom: ${yPosition}px;
            left: 0;
            width: 100%;
            height: 100px;
            z-index: 9999;
            pointer-events: none;
            overflow: hidden;
        `;

        // Create pets based on selections
        selections.forEach((petType, index) => {
            const pet = createPet(petType, index, speed, selectedCat);
            container.appendChild(pet);
        });

        // Add container to page
        document.body.appendChild(container);

        // Inject CSS animations with custom speed
        injectPetStyles(speed);

        // Hover interactions are now handled in startPositionTracking
        
        // Start position tracking
        startPositionTracking(container, speed);
    }

    // Create individual pet element
    function createPet(petType, index, speed, selectedCat) {
        const pet = document.createElement('div');
        pet.id = `my-pet-${petType}`;
        pet.className = `my-pet-animal my-pet-${petType}`;
        
        // Get pet definition from PetManager
        const petDef = PetManager.getPet(petType);
        if (!petDef) {
            console.error(`Pet type '${petType}' not found!`);
            return pet;
        }
        
        // Create animated pet content
        const petContent = document.createElement('div');
        petContent.className = `my-pet-sprite my-pet-${petType}-sprite`;
        petContent.innerHTML = petDef.html();
        
        // If it's a PNG-based pet, set the image source based on selected cat
        if (petDef.type === 'png') {
            const petImg = petContent.querySelector('.pet-image');
            if (petImg) {
                // Use the selected cat image with Chrome extension URL
                petImg.src = chrome.runtime.getURL(`pets/${selectedCat}.png`);
            }
        }
        
        pet.appendChild(petContent);
        
        // Position and style
        pet.style.cssText = `
            position: absolute;
            width: 60px;
            height: 60px;
            bottom: ${index * 50}px;
            left: -50px;
            pointer-events: auto;
            cursor: pointer;
            user-select: none;
            transition: transform 0.3s ease;
            will-change: transform, left;
        `;

        return pet;
    }


    // Inject CSS styles for animations
    function injectPetStyles(speed) {
        // Remove existing styles if any
        const existingStyle = document.getElementById('my-pet-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = 'my-pet-styles';
        // Base animations
        const baseCSS = `
            @keyframes my-pet-parade {
                0% {
                    left: -50px;
                    transform: translateX(0) translateY(0);
                }
                100% {
                    left: 100%;
                    transform: translateX(0) translateY(0);
                }
            }

            @keyframes tail-wag {
                0%, 100% { transform: rotate(-10deg); }
                50% { transform: rotate(10deg); }
            }

            @keyframes leg-walk {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(-15deg); }
                50% { transform: rotate(0deg); }
                75% { transform: rotate(15deg); }
            }

            .my-pet-animal {
                transition: transform 0.3s ease;
            }

            .my-pet-animal:hover {
                cursor: pointer;
            }
        `;
        
        // Get all pet CSS dynamically
        const petCSS = PetManager.getAllCSS();
        
        style.textContent = baseCSS + '\n' + petCSS;

        document.head.appendChild(style);
    }


    // Custom animation with position preservation
    function startPositionTracking(container, speed) {
        const pets = container.querySelectorAll('.my-pet-animal');
        
        pets.forEach((pet, index) => {
            // Get pet type from the pet element
            const petType = pet.id.replace('my-pet-', '');
            let isHovered = false;
            let animationId = null;
            let startTime = Date.now();
            let pauseTime = 0;
            let totalPauseTime = 0;
            let currentPosition = -50;
            let isAnimating = true;
            
            // Custom animation function
            const animate = () => {
                if (!isHovered && isAnimating) {
                    const elapsed = Date.now() - startTime - totalPauseTime;
                    const progress = (elapsed % (speed * 1000)) / (speed * 1000);
                    currentPosition = -50 + (progress * (window.innerWidth + 50));
                    pet.style.left = currentPosition + 'px';
                    animationId = requestAnimationFrame(animate);
                }
            };
            
            // Start animation with delay
            setTimeout(() => {
                animate();
            }, index * 2000);
            
            pet.addEventListener('mouseenter', function() {
                if (isHovered) return;
                
                isHovered = true;
                pauseTime = Date.now();
                
                // Stop custom animation
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
                
                // Apply visual effects - scale up and pause
                this.style.setProperty('transform', 'scale(1.5)', 'important');
                this.style.setProperty('transition', 'all 0.3s ease', 'important');
                this.style.setProperty('z-index', '10000', 'important');
                
                // Apply hover effects for PNG-based pets
                try {
                    const currentPetType = this.id.replace('my-pet-', '');
                    // console.log('Current pet type:', currentPetType);
                    const petDef = PetManager.getPet(currentPetType);
                    if (petDef && petDef.type === 'png') {
                        const petImg = this.querySelector('.pet-image');
                        if (petImg) {
                            // Add hover animation class
                            petImg.style.animation = 'pet-hover 0.5s ease-in-out infinite';
                        }
                    }
                } catch (error) {
                    console.error('Error in hover effect:', error);
                }
                
                // console.log('Pet paused at position:', currentPosition);
            });
            
            pet.addEventListener('mouseleave', function() {
                if (!isHovered) return;
                
                isHovered = false;
                totalPauseTime += Date.now() - pauseTime;
                
                // Remove visual effects
                this.style.setProperty('transform', 'scale(1)', 'important');
                this.style.setProperty('z-index', 'auto', 'important');
                
                // Restore walking animation for PNG-based pets
                try {
                    const currentPetType = this.id.replace('my-pet-', '');
                    // console.log('Restoring pet type:', currentPetType);
                    const petDef = PetManager.getPet(currentPetType);
                    if (petDef && petDef.type === 'png') {
                        const petImg = this.querySelector('.pet-image');
                        if (petImg) {
                            // Restore walking animation
                            petImg.style.animation = 'pet-walk 0.8s ease-in-out infinite';
                        }
                    }
                } catch (error) {
                    console.error('Error in unhover effect:', error);
                }
                
                // Resume custom animation from current position
                isAnimating = true;
                animate();
                
                // console.log('Pet resumed parading from position:', currentPosition);
            });
        });
    }

    // Listen for storage changes to update pets dynamically
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'sync') {
            if (changes['my-pet-selections'] || changes['my-pet-enabled'] || changes['my-pet-y-position'] || changes['my-pet-speed'] || changes['my-pet-selected-cat']) {
                chrome.storage.sync.get(['my-pet-selections', 'my-pet-enabled', 'my-pet-y-position', 'my-pet-speed', 'my-pet-selected-cat'], function(result) {
                    const selections = result['my-pet-selections'] || [];
                    const isEnabled = result['my-pet-enabled'] || false;
                    const yPosition = result['my-pet-y-position'] || 0;
                    const speed = result['my-pet-speed'] || 10;
                    const selectedCat = result['my-pet-selected-cat'] || 'cat-1';

                    if (isEnabled && selections.length > 0) {
                        createPetParade(selections, yPosition, speed, selectedCat);
                    } else {
                        // Remove pets if disabled
                        const container = document.getElementById('my-pet-container');
                        if (container) {
                            container.remove();
                        }
                    }
                });
            }
        }
    });

})();
