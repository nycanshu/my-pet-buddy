// My Pet Buddy - Pet Definitions
// Easy to add new pets by following the pattern below

const PETS = {
    cat: {
        name: 'Cat',
        emoji: '🐱',
        color: '#ff9500',
        size: { width: 60, height: 60 },
        type: 'png', // Updated to use PNG images
        images: {
            walk: 'pets/cat-1.png', // Default cat image for walking
            idle: 'pets/cat-1.png', // Default cat image for idle
            hover: 'pets/cat-1.png' // Default cat image for hover
        },
        animations: {
            walk: 'pet-walk',
            hover: 'pet-hover',
            idle: 'pet-idle'
        },
        html: () => `
            <div class="pet-image-container">
                <img class="pet-image" src="" alt="Cat" />
            </div>
        `,
        css: () => `
            @keyframes pet-walk {
                0%, 100% { transform: translateY(0px); }
                25% { transform: translateY(-3px); }
                50% { transform: translateY(0px); }
                75% { transform: translateY(-1px); }
            }

            @keyframes pet-hover {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }

            @keyframes pet-idle {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-1px); }
            }

            .my-pet-cat .pet-image-container {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .my-pet-cat .pet-image {
                width: 60px;
                height: 60px;
                object-fit: contain;
                animation: pet-walk 0.8s ease-in-out infinite;
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .my-pet-cat:hover .pet-image {
                animation: pet-hover 0.5s ease-in-out infinite;
                transform: scale(1.1);
            }
        `
    },


    // Example: How to add a new pet
    bird: {
        name: 'Bird',
        emoji: '🐦',
        color: '#87CEEB',
        size: { width: 20, height: 15 },
        animations: {
            walk: 'bird-fly',
            tail: 'bird-tail',
            legs: 'bird-legs'
        },
        html: () => `
            <div class="bird-body"></div>
            <div class="bird-wing bird-wing-left"></div>
            <div class="bird-wing bird-wing-right"></div>
            <div class="bird-head">
                <div class="bird-beak"></div>
                <div class="bird-eye"></div>
            </div>
            <div class="bird-tail"></div>
        `,
        css: () => `
            @keyframes bird-fly {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                25% { transform: translateY(-3px) rotate(2deg); }
                50% { transform: translateY(-5px) rotate(0deg); }
                75% { transform: translateY(-2px) rotate(-2deg); }
            }

            @keyframes bird-wing-flap {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(15deg); }
            }

            .my-pet-bird .bird-body {
                position: absolute;
                width: 20px;
                height: 15px;
                background: #87CEEB;
                border-radius: 50%;
                top: 25px;
                left: 20px;
                animation: bird-fly 0.6s ease-in-out infinite;
            }

            .my-pet-bird .bird-head {
                position: absolute;
                width: 12px;
                height: 10px;
                background: #87CEEB;
                border-radius: 50%;
                top: 15px;
                left: 25px;
                animation: bird-fly 0.6s ease-in-out infinite;
            }

            .my-pet-bird .bird-wing {
                position: absolute;
                width: 8px;
                height: 6px;
                background: #4682B4;
                border-radius: 50%;
                top: 20px;
                animation: bird-wing-flap 0.3s ease-in-out infinite;
            }

            .my-pet-bird .bird-wing-left {
                left: 15px;
            }

            .my-pet-bird .bird-wing-right {
                right: 15px;
            }

            .my-pet-bird .bird-beak {
                position: absolute;
                width: 3px;
                height: 2px;
                background: #FFA500;
                border-radius: 50%;
                top: 5px;
                left: 8px;
            }

            .my-pet-bird .bird-eye {
                position: absolute;
                width: 2px;
                height: 2px;
                background: #000;
                border-radius: 50%;
                top: 3px;
                left: 6px;
            }

            .my-pet-bird .bird-tail {
                position: absolute;
                width: 10px;
                height: 4px;
                background: #4682B4;
                border-radius: 2px;
                top: 30px;
                left: 0px;
                animation: tail-wag 1s ease-in-out infinite;
            }
        `
    }
};

// Helper functions for pet management
const PetManager = {
    // Get all available pets
    getAllPets: () => Object.keys(PETS),
    
    // Get pet definition by type
    getPet: (type) => PETS[type],
    
    // Get pet HTML
    getPetHTML: (type) => {
        const pet = PETS[type];
        return pet ? pet.html() : '';
    },
    
    // Get pet CSS
    getPetCSS: (type) => {
        const pet = PETS[type];
        return pet ? pet.css() : '';
    },
    
    // Get all CSS for all pets
    getAllCSS: () => {
        return Object.values(PETS)
            .map(pet => pet.css())
            .join('\n');
    },
    
    // Add a new pet (for dynamic addition)
    addPet: (type, petDefinition) => {
        PETS[type] = petDefinition;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PETS, PetManager };
}
