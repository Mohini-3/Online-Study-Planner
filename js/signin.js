// Real-time form validation
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const signinForm = document.getElementById('signinForm');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation function
function validatePassword(password) {
    const minLength = password.length >= 8;
    const hasCapital = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
        valid: minLength && hasCapital && hasSpecial,
        minLength,
        hasCapital,
        hasSpecial
    };
}

// Email input validation
emailInput.addEventListener('input', function() {
    const value = this.value.trim();
    
    if (value === '') {
        emailInput.classList.remove('error', 'success');
        emailError.classList.remove('show');
        return;
    }
    
    if (!emailRegex.test(value)) {
        emailInput.classList.add('error');
        emailInput.classList.remove('success');
        emailError.textContent = 'Please enter a valid email address';
        emailError.classList.add('show');
    } else {
        emailInput.classList.remove('error');
        emailInput.classList.add('success');
        emailError.classList.remove('show');
    }
});

// Password input validation
passwordInput.addEventListener('input', function() {
    const value = this.value;
    
    if (value === '') {
        passwordInput.classList.remove('error', 'success');
        passwordError.classList.remove('show');
        return;
    }
    
    const validation = validatePassword(value);
    
    if (!validation.valid) {
        passwordInput.classList.add('error');
        passwordInput.classList.remove('success');
        
        let errors = [];
        if (!validation.minLength) errors.push('minimum 8 characters');
        if (!validation.hasCapital) errors.push('1 capital letter');
        if (!validation.hasSpecial) errors.push('1 special symbol');
        
        passwordError.textContent = 'Password must contain: ' + errors.join(', ');
        passwordError.classList.add('show');
    } else {
        passwordInput.classList.remove('error');
        passwordInput.classList.add('success');
        passwordError.classList.remove('show');
    }
});

// Form submission validation
signinForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;
    let isValid = true;
    
    // Validate email
    if (emailValue === '' || !emailRegex.test(emailValue)) {
        emailInput.classList.add('error');
        emailError.textContent = 'Please enter a valid email address';
        emailError.classList.add('show');
        isValid = false;
    }
    
    // Validate password
    const passwordValidation = validatePassword(passwordValue);
    if (!passwordValidation.valid) {
        passwordInput.classList.add('error');
        let errors = [];
        if (!passwordValidation.minLength) errors.push('minimum 8 characters');
        if (!passwordValidation.hasCapital) errors.push('1 capital letter');
        if (!passwordValidation.hasSpecial) errors.push('1 special symbol');
        passwordError.textContent = 'Password must contain: ' + errors.join(', ');
        passwordError.classList.add('show');
        isValid = false;
    }
    
    if (isValid) {
        // Form is valid, you can submit it
        alert('Sign in successful! (This is a demo)');
        // In a real application, you would submit the form here
    }
});
