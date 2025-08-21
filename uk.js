// Medical Questionnaire JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeYesNoButtons();
    initializeConditionalFields();
    initializeFormHandlers();
    initializeNavigationButtons();
});

function initializeTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Find currently active tab & section
            const activeTab = document.querySelector('.tab-btn.active');
            const activeSection = document.querySelector('.section.active');

            // Deactivate current
            if (activeTab) activeTab.classList.remove('active');
            if (activeSection) {
                activeSection.classList.remove('active');
                activeSection.classList.add('hidden');
            }

            // Activate new
            tab.classList.add('active');
            const target = document.getElementById(tab.id.replace('Tab', 'Section'));
            if (target) {
                target.classList.add('active');
                target.classList.remove('hidden');
            }
            
            // Update navigation buttons state
            updateNavigationButtons();
            
            // Scroll to top of form
            document.querySelector('.bg-gray-800.rounded-b-lg').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        });
    });
}

// Initialize navigation buttons
function initializeNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.addEventListener('click', navigateToPreviousTab);
    nextBtn.addEventListener('click', navigateToNextTab);
    
    // Set initial state
    updateNavigationButtons();
}

function navigateToPreviousTab() {
    const tabs = Array.from(document.querySelectorAll('.tab-btn'));
    const currentTab = document.querySelector('.tab-btn.active');
    const currentIndex = tabs.indexOf(currentTab);
    initializeTabs();
    
    if (currentIndex > 0) {
        tabs[currentIndex - 1].click();
    }
}

function navigateToNextTab() {
    const tabs = Array.from(document.querySelectorAll('.tab-btn'));
    const currentTab = document.querySelector('.tab-btn.active');
    const currentIndex = tabs.indexOf(currentTab);
    initializeTabs();
    
    if (currentIndex < tabs.length - 1) {
        tabs[currentIndex + 1].click();
    }
}

function updateNavigationButtons() {
    const tabs = Array.from(document.querySelectorAll('.tab-btn'));
    const currentTab = document.querySelector('.tab-btn.active');
    const currentIndex = tabs.indexOf(currentTab);
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
   // Update previous button
if (currentIndex === 0) {
    prevBtn.style.visibility = 'hidden';
} else {
    prevBtn.style.visibility = 'visible';
}

// Update next button
if (currentIndex === tabs.length - 1) {
    nextBtn.style.visibility = 'hidden';
} else {
    nextBtn.style.visibility = 'visible';
}
}

// Yes/No button functionality
function initializeYesNoButtons() {
    const yesNoButtons = document.querySelectorAll('.yes-btn, .no-btn');
    
    yesNoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const value = this.getAttribute('data-value');
            const hiddenInput = document.querySelector(`input[name="${target}"]`);
            
            if (hiddenInput) {
                hiddenInput.value = value;
                
                // Update button states
                const buttonGroup = this.parentElement;
                const allButtons = buttonGroup.querySelectorAll('.yes-btn, .no-btn');
                allButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Add animation effect
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
                
                // Handle conditional field visibility
                handleConditionalFields(target, value);
            }
        });
    });
}

// Handle conditional field visibility
function initializeConditionalFields() {
    // Set initial states
    handleConditionalFields('pregnancy_loss', 'no');
    handleConditionalFields('multiple_pregnancy', 'no');
}

function handleConditionalFields(fieldName, value) {
    switch(fieldName) {
        case 'pregnancy_loss':
            const pregnancyLossDetails = document.getElementById('pregnancyLossDetails');
            if (pregnancyLossDetails) {
                if (value === 'yes') {
                    pregnancyLossDetails.classList.remove('hidden');
                    pregnancyLossDetails.style.animation = 'fadeIn 0.3s ease-in-out';
                } else {
                    pregnancyLossDetails.classList.add('hidden');
                }
            }
            break;
            
        case 'multiple_pregnancy':
            const multiplePregnancyDetails = document.getElementById('multiplePregnancyDetails');
            if (multiplePregnancyDetails) {
                if (value === 'yes') {
                    multiplePregnancyDetails.classList.remove('hidden');
                    multiplePregnancyDetails.style.animation = 'fadeIn 0.3s ease-in-out';
                } else {
                    multiplePregnancyDetails.classList.add('hidden');
                }
            }
            break;
    }
}

// Form handlers
function initializeFormHandlers() {
    const form = document.getElementById('medicalForm');
    const resetBtn = document.getElementById('resetBtn');
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });
    
    // Reset button
    resetBtn.addEventListener('click', function() {
        // Add animation effect
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            resetForm();
        }, 100);
    });
    
    // Input validation
    setupInputValidation();
}

function handleFormSubmission() {
    const formData = new FormData(document.getElementById('medicalForm'));
    const data = {};
    
    // Convert FormData to regular object
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Add validation
    const errors = validateForm(data);
    
    if (errors.length > 0) {
        displayErrors(errors);
        return;
    }
    
    // Show loading state
    showLoadingState();
    
    // Simulate API call
    setTimeout(() => {
        hideLoadingState();
        showSuccessMessage('Assessment completed successfully!');
        console.log('Form Data:', data);
        
        // Scroll to success message
        setTimeout(() => {
            const successMessage = document.querySelector('.success-message');
            if (successMessage) {
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 100);
    }, 2000);
}

function validateForm(data) {
    const errors = [];
    
    // Required field validation
    const requiredFields = [
        'maternal_age',
        'gestation_weeks',
        'bmi'
    ];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors.push(`${field.replace('_', ' ')} is required`);
        }
    });
    
    // Range validations
    if (data.maternal_age && (data.maternal_age < 10 || data.maternal_age > 60)) {
        errors.push('Maternal age should be between 10 and 60 years');
    }
    
    if (data.gestation_weeks && (data.gestation_weeks < 4 || data.gestation_weeks > 42)) {
        errors.push('Gestational weeks should be between 4 and 42');
    }
    
    if (data.gestation_days && (data.gestation_days < 0 || data.gestation_days > 6)) {
        errors.push('Gestational days should be between 0 and 6');
    }
    
    // APGAR score validation
    const apgarFields = ['apgar_1min', 'apgar_5min', 'apgar_10min'];
    apgarFields.forEach(field => {
        if (data[field] && (data[field] < 0 || data[field] > 10)) {
            errors.push(`${field} should be between 0 and 10`);
        }
    });
    
    return errors;
}

function displayErrors(errors) {
    removeMessages();
    const form = document.getElementById('medicalForm');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <h4 class="font-semibold mb-2">Please correct the following errors:</h4>
        <ul class="list-disc list-inside">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    form.appendChild(errorDiv);
    
    // Scroll to error message
    setTimeout(() => {
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function showSuccessMessage(message) {
    removeMessages();
    const form = document.getElementById('medicalForm');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <h4 class="font-semibold mb-2">Success!</h4>
        <p>${message}</p>
    `;
    form.appendChild(successDiv);
}

function removeMessages() {
    const existingMessages = document.querySelectorAll('.error-message, .success-message');
    existingMessages.forEach(msg => msg.remove());
}

function showLoadingState() {
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'CALCULATING...';
    document.getElementById('medicalForm').classList.add('loading');
    
    // Add pulsing animation
    submitBtn.style.animation = 'pulse 1.5s infinite';
}

function hideLoadingState() {
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'CALCULATE';
    submitBtn.style.animation = 'none';
    document.getElementById('medicalForm').classList.remove('loading');
}

function resetForm() {
    // Reset form fields
    document.getElementById('medicalForm').reset();
    
    // Reset yes/no buttons to default state (NO active)
    const yesButtons = document.querySelectorAll('.yes-btn');
    const noButtons = document.querySelectorAll('.no-btn');
    
    yesButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.backgroundColor = '#374151';
        btn.style.color = '#9ca3af';
        btn.style.borderColor = '#4b5563';
    });
    
    noButtons.forEach(btn => {
        btn.classList.add('active');
        btn.style.backgroundColor = '';
        btn.style.color = '';
        btn.style.borderColor = '';
    });
    
    // Reset hidden inputs to 'no'
    const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
    hiddenInputs.forEach(input => {
        if (input.name !== 'maternal_parity') {
            input.value = 'no';
        }
    });
    
    // Hide conditional fields
    document.getElementById('pregnancyLossDetails').classList.add('hidden');
    document.getElementById('multiplePregnancyDetails').classList.add('hidden');
    
    // Remove any messages
    removeMessages();
    
    // Switch to first tab
    document.querySelector('.tab-btn').click();
    
    // Show success message
    showSuccessMessage('Form has been reset successfully!');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupInputValidation() {
    // Real-time validation for numeric inputs
    const numericInputs = document.querySelectorAll('input[type="number"]');
    
    numericInputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            const name = this.name;
            
            // Remove any existing validation styling
            this.classList.remove('border-red-500', 'border-green-500');
            
            // Apply validation styling based on field
            switch(name) {
                case 'maternal_age':
                    if (value && (value < 10 || value > 60)) {
                        this.classList.add('border-red-500');
                    } else if (value) {
                        this.classList.add('border-green-500');
                    }
                    break;
                    
                case 'gestation_weeks':
                    if (value && (value < 4 || value > 42)) {
                        this.classList.add('border-red-500');
                    } else if (value) {
                        this.classList.add('border-green-500');
                    }
                    break;
                    
                case 'gestation_days':
                    if (value && (value < 0 || value > 6)) {
                        this.classList.add('border-red-500');
                    } else if (value >= 0) {
                        this.classList.add('border-green-500');
                    }
                    break;
                    
                case 'apgar_1min':
                case 'apgar_5min':
                case 'apgar_10min':
                    if (value && (value < 0 || value > 10)) {
                        this.classList.add('border-red-500');
                    } else if (value >= 0) {
                        this.classList.add('border-green-500');
                    }
                    break;
            }
        });
    });
    
    // Prevent invalid characters in numeric inputs
    numericInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            // Allow: backspace, delete, tab, escape, enter, decimal point
            if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    });
    
    // Add focus animation to inputs
    const allInputs = document.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Auto-save functionality (optional)
function setupAutoSave() {
    const form = document.getElementById('medicalForm');
    let saveTimeout;
    
    form.addEventListener('input', function() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Note: localStorage is not available in Claude artifacts
            // In a real implementation, you would save to localStorage or server
            console.log('Auto-saved:', data);
        }, 2000);
    });
}

// Add CSS animation for pulse effect
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.7; }
        100% { opacity: 1; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
    }
`;
document.head.appendChild(style);

// Export functions for external use
window.MedicalQuestionnaire = {
    resetForm,
    validateForm,
    handleFormSubmission,
    navigateToPreviousTab,
    navigateToNextTab
};

const shortcuts = {
  n: () => nextBtn.click(),
  p: () => prevBtn.click()
};
document.addEventListener('keydown', (event) => {
  if (event.altKey && shortcuts[event.key]) {
    shortcuts[event.key]();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  // Pregnancy Loss Modal
  const pregnancyLossBtn = document.getElementById("pregnancyLossBtn");
  const pregnancyLossModal = document.getElementById("pregnancyLossModal");
  const closePregnancyLoss = document.getElementById("closePregnancyLoss");

  if (pregnancyLossBtn) {
    pregnancyLossBtn.addEventListener("click", () => {
      pregnancyLossModal.classList.remove("hidden");
    });

    closePregnancyLoss.addEventListener("click", () => {
      pregnancyLossModal.classList.add("hidden");
      pregnancyLossBtn.textContent = "Show";
    });
  }

  // APGAR Modal
  const apgarBtn = document.getElementById("apgarBtn");
  const apgarModal = document.getElementById("apgarModal");
  const closeApgarModal = document.getElementById("closeApgarModal");

  if (apgarBtn) {
    apgarBtn.addEventListener("click", () => {
      apgarModal.classList.remove("hidden");
    });

    closeApgarModal.addEventListener("click", () => {
      apgarModal.classList.add("hidden");
      apgarBtn.textContent = "Show"; // change button text
    });
  }
});
