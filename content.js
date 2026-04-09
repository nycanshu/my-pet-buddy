// My Pet Buddy - Content Script
// Handles pet animations and webpage integration

(function() {
    'use strict';

    // Prevent multiple instances
    if (window.myPetBuddyLoaded) {
        return;
    }
    window.myPetBuddyLoaded = true;

    // Current popup theme — used to style the motivational bubble.
    // Mirrors the same fallback logic as popup.js: stored value wins,
    // otherwise honor the OS prefers-color-scheme.
    let currentTheme = 'light';
    function resolveTheme(stored) {
        if (stored === 'dark' || stored === 'light') return stored;
        return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Get pet selections and enabled status from storage
    chrome.storage.sync.get(['my-pet-selections', 'my-pet-enabled', 'my-pet-y-position', 'my-pet-speed', 'my-pet-selected-cat', 'my-pet-motion-mode', 'my-pet-theme'], function(result) {
        const selections = result['my-pet-selections'] || [];
        const isEnabled = result['my-pet-enabled'] || false;
        const yPosition = result['my-pet-y-position'] || 0;
        const speed = result['my-pet-speed'] || 10;
        const selectedCat = result['my-pet-selected-cat'] || 'cat-1';
        const motionMode = result['my-pet-motion-mode'] || 'parade';
        currentTheme = resolveTheme(result['my-pet-theme']);

        if (isEnabled && selections.length > 0) {
            createPetParade(selections, yPosition, speed, selectedCat, motionMode);
        }
    });

    // Create the pet parade container and pets
    function createPetParade(selections, yPosition, speed, selectedCat, motionMode) {
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
            const pet = createPet(petType, index, speed, selectedCat, motionMode);
            container.appendChild(pet);
        });

        // Add container to page
        document.body.appendChild(container);

        // Inject CSS animations with custom speed
        injectPetStyles(speed);

        // Hover interactions: parade mode wires them up inside startPositionTracking
        // (so it can pause/resume the rAF loop). Static modes need them attached
        // separately — same hover-pop, no pause/resume callbacks needed.
        if (motionMode === 'parade') {
            startPositionTracking(container, speed);
        } else {
            container.querySelectorAll('.my-pet-animal').forEach(function(pet) {
                attachHoverEffects(pet);
            });
        }

        // Schedule periodic motivational messages on the first pet
        const firstPet = container.querySelector('.my-pet-animal');
        if (firstPet) {
            scheduleMotivationalMessages(firstPet);
        }
    }

    // Create individual pet element
    function createPet(petType, index, speed, selectedCat, motionMode) {
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

        // Compute horizontal placement based on motion mode.
        // Static modes sit 25px from the edge so the hover scale-up (1.5×,
        // around center) has enough breathing room not to be clipped by
        // the container's overflow: hidden — matching parade's clean scale.
        let horizontalCSS;
        if (motionMode === 'left') {
            horizontalCSS = 'left: 25px;';
        } else if (motionMode === 'right') {
            horizontalCSS = 'right: 25px;';
        } else {
            horizontalCSS = 'left: -50px;'; // parade — animation will sweep this
        }

        // Position and style
        pet.style.cssText = `
            position: absolute;
            width: 60px;
            height: 60px;
            bottom: ${index * 50}px;
            ${horizontalCSS}
            pointer-events: auto;
            cursor: pointer;
            user-select: none;
            transition: transform 0.3s ease;
            will-change: transform, left;
        `;

        // Click to pet — spawns floating hearts (works in all motion modes)
        pet.addEventListener('click', function(e) {
            e.stopPropagation();
            spawnHearts(this);
        });

        return pet;
    }

    // Motivational messages — shown periodically in a speech bubble above the pet
    const MOTIVATIONAL_MESSAGES = [
        "You're doing great! 🌟",
        "Take a deep breath. You got this!",
        "Time for a stretch break? 🧘",
        "Stay hydrated! 💧",
        "Small steps, big progress.",
        "You're stronger than you think.",
        "One task at a time. ✨",
        "Don't forget to smile 😊",
        "Be kind to yourself today.",
        "Almost there — keep going!",
        "Look how far you've come.",
        "Your effort matters.",
        "Take a moment for you.",
        "Progress over perfection.",
        "You make the day brighter 🌈"
    ];

    const MOTIVATION_FIRST_DELAY_MS = 30 * 1000;       // first message after 30s
    const MOTIVATION_MIN_INTERVAL_MS = 2 * 60 * 1000;  // then every 2–5 min
    const MOTIVATION_MAX_INTERVAL_MS = 5 * 60 * 1000;
    const MOTIVATION_BUBBLE_DURATION_MS = 5000;        // visible for 5s

    let motivationTimerId = null;

    function showMotivationalMessage(petEl) {
        if (!petEl.isConnected) return;

        const bubble = document.createElement('div');
        bubble.className = `my-pet-bubble theme-${currentTheme}`;
        bubble.textContent = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
        bubble.style.animation = 'my-pet-bubble-in 0.3s ease-out forwards';
        document.body.appendChild(bubble);

        // Track the pet position every frame so the bubble walks alongside it
        // in parade mode (no-op cost in static modes — pet rect doesn't change).
        let trackingActive = true;
        function trackPosition() {
            if (!trackingActive || !petEl.isConnected) {
                trackingActive = false;
                return;
            }
            const petRect = petEl.getBoundingClientRect();
            bubble.style.left = `${petRect.left + petRect.width / 2}px`;
            bubble.style.top = `${petRect.top - 60}px`;
            requestAnimationFrame(trackPosition);
        }
        trackPosition();

        setTimeout(() => {
            bubble.style.animation = 'my-pet-bubble-out 0.4s ease-in forwards';
            setTimeout(() => {
                trackingActive = false;
                bubble.remove();
            }, 400);
        }, MOTIVATION_BUBBLE_DURATION_MS);
    }

    function scheduleMotivationalMessages(petEl) {
        // Clear any prior schedule (e.g., when storage changes re-render the parade)
        if (motivationTimerId) {
            clearTimeout(motivationTimerId);
            motivationTimerId = null;
        }

        const tick = () => {
            showMotivationalMessage(petEl);
            const nextDelay = MOTIVATION_MIN_INTERVAL_MS +
                Math.random() * (MOTIVATION_MAX_INTERVAL_MS - MOTIVATION_MIN_INTERVAL_MS);
            motivationTimerId = setTimeout(tick, nextDelay);
        };

        motivationTimerId = setTimeout(tick, MOTIVATION_FIRST_DELAY_MS);
    }

    // Spawn floating hearts above a pet when clicked.
    // Appended to <body> with position: fixed so they escape the
    // 100px-tall #my-pet-container clip and can soar above the pet.
    function spawnHearts(petEl) {
        const petRect = petEl.getBoundingClientRect();
        const baseX = petRect.left + petRect.width / 2;
        const baseY = petRect.top;

        const HEART_EMOJIS = ['❤️', '💖', '💕', '💗', '💓'];

        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('div');
            heart.className = 'my-pet-heart';
            heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
            const offsetX = (Math.random() - 0.5) * 60;
            const delay = i * 80;
            heart.style.left = `${baseX + offsetX}px`;
            heart.style.top = `${baseY}px`;
            heart.style.animation = `my-pet-heart-float 1.6s ease-out ${delay}ms forwards`;
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 2000 + delay);
        }
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

            @keyframes my-pet-heart-float {
                0%   { opacity: 0; transform: translate(-50%, 0) scale(0.4); }
                15%  { opacity: 1; transform: translate(-50%, -20px) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -140px) scale(1.2); }
            }

            .my-pet-heart {
                position: fixed;
                font-size: 24px;
                pointer-events: none;
                user-select: none;
                z-index: 10000;
                will-change: transform, opacity;
            }

            @keyframes my-pet-bubble-in {
                0%   { opacity: 0; transform: translate(-50%, 8px) scale(0.85); }
                100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
            }

            @keyframes my-pet-bubble-out {
                0%   { opacity: 1; transform: translate(-50%, 0) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -6px) scale(0.95); }
            }

            /* Thought bubble — cloud-like rounded shape with two trailing dots
               leading down to the pet, à la comic-strip "thinking" speech bubble. */
            .my-pet-bubble {
                position: fixed;
                max-width: 200px;
                padding: 12px 18px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 13px;
                font-weight: 500;
                line-height: 1.4;
                border-radius: 26px;
                pointer-events: none;
                user-select: none;
                white-space: normal;
                text-align: center;
                z-index: 10001;
            }

            /* Bigger trailing dot — sits just below the bubble */
            .my-pet-bubble::before {
                content: '';
                position: absolute;
                bottom: -12px;
                left: 50%;
                transform: translateX(-50%);
                width: 14px;
                height: 14px;
                border-radius: 50%;
            }

            /* Smaller trailing dot — sits below the bigger one, closer to the pet */
            .my-pet-bubble::after {
                content: '';
                position: absolute;
                bottom: -28px;
                left: 50%;
                transform: translateX(-50%);
                width: 8px;
                height: 8px;
                border-radius: 50%;
            }

            /* Light theme */
            .my-pet-bubble.theme-light {
                background: #ffffff;
                color: #2c3e50;
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
            }
            .my-pet-bubble.theme-light::before,
            .my-pet-bubble.theme-light::after {
                background: #ffffff;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
            }

            /* Dark theme */
            .my-pet-bubble.theme-dark {
                background: #2a2e36;
                color: #f0f0f0;
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.55);
            }
            .my-pet-bubble.theme-dark::before,
            .my-pet-bubble.theme-dark::after {
                background: #2a2e36;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
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


    // Attach hover-pop visual effects (scale-up, z-index, image-animation swap).
    // Used by both parade and static modes; the optional onPause/onResume
    // callbacks let parade mode pause/resume its rAF loop on hover.
    function attachHoverEffects(petEl, onPause, onResume) {
        let isHovered = false;

        petEl.addEventListener('mouseenter', function() {
            if (isHovered) return;
            isHovered = true;

            this.style.setProperty('transform', 'scale(1.5)', 'important');
            this.style.setProperty('transition', 'all 0.3s ease', 'important');
            this.style.setProperty('z-index', '10000', 'important');

            try {
                const petType = this.id.replace('my-pet-', '');
                const petDef = PetManager.getPet(petType);
                if (petDef?.type === 'png') {
                    const petImg = this.querySelector('.pet-image');
                    if (petImg) {
                        petImg.style.animation = 'pet-hover 0.5s ease-in-out infinite';
                    }
                }
            } catch (error) {
                console.error('Error in hover effect:', error);
            }

            if (onPause) onPause();
        });

        petEl.addEventListener('mouseleave', function() {
            if (!isHovered) return;
            isHovered = false;

            this.style.setProperty('transform', 'scale(1)', 'important');
            this.style.setProperty('z-index', 'auto', 'important');

            try {
                const petType = this.id.replace('my-pet-', '');
                const petDef = PetManager.getPet(petType);
                if (petDef?.type === 'png') {
                    const petImg = this.querySelector('.pet-image');
                    if (petImg) {
                        petImg.style.animation = 'pet-walk 0.8s ease-in-out infinite';
                    }
                }
            } catch (error) {
                console.error('Error in unhover effect:', error);
            }

            if (onResume) onResume();
        });
    }

    // Parade mode: drives pet position via rAF and uses attachHoverEffects
    // with pause/resume callbacks so hovering freezes the parade.
    function startPositionTracking(container, speed) {
        const pets = container.querySelectorAll('.my-pet-animal');

        pets.forEach((pet, index) => {
            let animationId = null;
            let startTime = Date.now();
            let pauseTime = 0;
            let totalPauseTime = 0;
            let currentPosition = -50;
            let isPaused = false;

            const animate = () => {
                if (!isPaused) {
                    const elapsed = Date.now() - startTime - totalPauseTime;
                    const progress = (elapsed % (speed * 1000)) / (speed * 1000);
                    currentPosition = -50 + (progress * (window.innerWidth + 50));
                    pet.style.left = currentPosition + 'px';
                    animationId = requestAnimationFrame(animate);
                }
            };

            setTimeout(() => animate(), index * 2000);

            attachHoverEffects(pet,
                function onPause() {
                    isPaused = true;
                    pauseTime = Date.now();
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                },
                function onResume() {
                    isPaused = false;
                    totalPauseTime += Date.now() - pauseTime;
                    animate();
                }
            );
        });
    }

    // Listen for storage changes to update pets dynamically
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace !== 'sync') return;

        // Theme can change independently of the pet config — pick up new value
        // for the next bubble without re-rendering the parade.
        if (changes['my-pet-theme']) {
            currentTheme = resolveTheme(changes['my-pet-theme'].newValue);
        }

        if (changes['my-pet-selections'] || changes['my-pet-enabled'] || changes['my-pet-y-position'] || changes['my-pet-speed'] || changes['my-pet-selected-cat'] || changes['my-pet-motion-mode']) {
            chrome.storage.sync.get(['my-pet-selections', 'my-pet-enabled', 'my-pet-y-position', 'my-pet-speed', 'my-pet-selected-cat', 'my-pet-motion-mode'], function(result) {
                const selections = result['my-pet-selections'] || [];
                const isEnabled = result['my-pet-enabled'] || false;
                const yPosition = result['my-pet-y-position'] || 0;
                const speed = result['my-pet-speed'] || 10;
                const selectedCat = result['my-pet-selected-cat'] || 'cat-1';
                const motionMode = result['my-pet-motion-mode'] || 'parade';

                if (isEnabled && selections.length > 0) {
                    createPetParade(selections, yPosition, speed, selectedCat, motionMode);
                } else {
                    // Remove pets if disabled
                    const container = document.getElementById('my-pet-container');
                    if (container) {
                        container.remove();
                    }
                }
            });
        }
    });

})();
