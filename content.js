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
    chrome.storage.sync.get(['my-pet-selections', 'my-pet-enabled', 'my-pet-y-position', 'my-pet-speed'], function(result) {
        const selections = result['my-pet-selections'] || [];
        const isEnabled = result['my-pet-enabled'] || false;
        const yPosition = result['my-pet-y-position'] || 0;
        const speed = result['my-pet-speed'] || 10;

        if (isEnabled && selections.length > 0) {
            createPetParade(selections, yPosition, speed);
        }
    });

    // Create the pet parade container and pets
    function createPetParade(selections, yPosition, speed) {
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
            const pet = createPet(petType, index, speed);
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
    function createPet(petType, index, speed) {
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
        
        // If it's a GIF-based pet, set the GIF source
        if (petDef.type === 'gif') {
            const gifImg = petContent.querySelector('.pet-gif');
            if (gifImg) {
                gifImg.src = petDef.gif.walk; // Start with walking GIF
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
                }
                
                // Apply visual effects - only size increase
                this.style.setProperty('transform', 'scale(1.5)', 'important');
                this.style.setProperty('transition', 'all 0.3s ease', 'important');
                this.style.setProperty('z-index', '10000', 'important');
                
                // Change GIF to hover state if it's a GIF-based pet
                const petDef = PetManager.getPet(petType);
                if (petDef && petDef.type === 'gif') {
                    const gifImg = this.querySelector('.pet-gif');
                    if (gifImg && petDef.gif.hover) {
                        gifImg.src = petDef.gif.hover;
                    }
                }
                
                console.log('Pet paused at position:', currentPosition);
            });
            
            pet.addEventListener('mouseleave', function() {
                if (!isHovered) return;
                
                isHovered = false;
                totalPauseTime += Date.now() - pauseTime;
                
                // Remove visual effects
                this.style.setProperty('transform', 'scale(1)', 'important');
                this.style.setProperty('z-index', 'auto', 'important');
                
                // Restore walking GIF if it's a GIF-based pet
                const petDef = PetManager.getPet(petType);
                if (petDef && petDef.type === 'gif') {
                    const gifImg = this.querySelector('.pet-gif');
                    if (gifImg && petDef.gif.walk) {
                        gifImg.src = petDef.gif.walk;
                    }
                }
                
                // Resume custom animation from current position
                animate();
                
                console.log('Pet resumed parading from position:', currentPosition);
            });
        });
    }

    // Listen for storage changes to update pets dynamically
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'sync') {
            if (changes['my-pet-selections'] || changes['my-pet-enabled'] || changes['my-pet-y-position'] || changes['my-pet-speed']) {
                chrome.storage.sync.get(['my-pet-selections', 'my-pet-enabled', 'my-pet-y-position', 'my-pet-speed'], function(result) {
                    const selections = result['my-pet-selections'] || [];
                    const isEnabled = result['my-pet-enabled'] || false;
                    const yPosition = result['my-pet-y-position'] || 0;
                    const speed = result['my-pet-speed'] || 10;

                    if (isEnabled && selections.length > 0) {
                        createPetParade(selections, yPosition, speed);
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
