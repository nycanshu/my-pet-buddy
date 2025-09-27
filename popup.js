// My Pet Buddy - Popup Logic
// Handles user interactions and storage management

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const catRadio = document.getElementById('my-pet-cat');
    const dogRadio = document.getElementById('my-pet-dog');
    const noneRadio = document.getElementById('my-pet-none');
    const yPositionSlider = document.getElementById('my-pet-y-position');
    const speedSlider = document.getElementById('my-pet-speed');
    const yValueSpan = document.getElementById('my-pet-y-value');
    const speedValueSpan = document.getElementById('my-pet-speed-value');
    const saveButton = document.getElementById('my-pet-save');
    const disableButton = document.getElementById('my-pet-disable');
    const statusDiv = document.getElementById('my-pet-status');

    // Load saved selections on popup open
    loadSavedSelections();

    // Event listeners
    saveButton.addEventListener('click', saveSelections);
    disableButton.addEventListener('click', disablePets);
    
    // Slider value updates
    yPositionSlider.addEventListener('input', function() {
        yValueSpan.textContent = this.value + 'px';
    });
    
    speedSlider.addEventListener('input', function() {
        speedValueSpan.textContent = this.value + 's';
    });

    // Load saved pet selections from storage
    function loadSavedSelections() {
        chrome.storage.sync.get(['my-pet-selections', 'my-pet-enabled', 'my-pet-y-position', 'my-pet-speed'], function(result) {
            const selections = result['my-pet-selections'] || [];
            const isEnabled = result['my-pet-enabled'] || false;
            const yPosition = result['my-pet-y-position'] || 0;
            const speed = result['my-pet-speed'] || 10;

            // Set radio button selection (only one pet allowed)
            if (selections.includes('cat')) {
                catRadio.checked = true;
            } else if (selections.includes('dog')) {
                dogRadio.checked = true;
            } else {
                noneRadio.checked = true;
            }

            // Set slider values
            yPositionSlider.value = yPosition;
            speedSlider.value = speed;
            yValueSpan.textContent = yPosition + 'px';
            speedValueSpan.textContent = speed + 's';

            // Update status display
            if (isEnabled && selections.length > 0) {
                statusDiv.textContent = `Active: ${selections[0]} selected`;
                statusDiv.style.color = '#4CAF50';
            } else {
                statusDiv.textContent = 'Pets disabled';
                statusDiv.style.color = '#666';
            }
        });
    }

    // Save selected pets to storage
    function saveSelections() {
        const selections = [];
        
        // Get selected pet (only one allowed)
        if (catRadio.checked) {
            selections.push('cat');
        } else if (dogRadio.checked) {
            selections.push('dog');
        }

        // Get customization values
        const yPosition = parseInt(yPositionSlider.value);
        const speed = parseInt(speedSlider.value);

        // Save to storage
        chrome.storage.sync.set({
            'my-pet-selections': selections,
            'my-pet-enabled': true,
            'my-pet-y-position': yPosition,
            'my-pet-speed': speed
        }, function() {
            if (selections.length > 0) {
                statusDiv.textContent = `Active: ${selections[0]} selected`;
                statusDiv.style.color = '#4CAF50';
            } else {
                statusDiv.textContent = 'No pet selected';
                statusDiv.style.color = '#666';
                return;
            }
            
            // Close popup after short delay
            setTimeout(() => {
                window.close();
            }, 500);
        });
    }

    // Disable all pets
    function disablePets() {
        chrome.storage.sync.set({
            'my-pet-enabled': false
        }, function() {
            statusDiv.textContent = 'Pets disabled';
            statusDiv.style.color = '#666';
            
            // Close popup after short delay
            setTimeout(() => {
                window.close();
            }, 500);
        });
    }

});
