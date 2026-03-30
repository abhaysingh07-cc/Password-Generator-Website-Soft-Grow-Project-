/* JAVASCRIPT LOGIC */

// DOM Elements
const displayEl = document.getElementById('password-display');
const copyBtn = document.getElementById('copy-btn');
const lengthEl = document.getElementById('length');
const lengthValEl = document.getElementById('length-value');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const uppercaseEl = document.getElementById('uppercase');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const generateBtn = document.getElementById('generate-btn');
const copyTooltip = document.getElementById('copy-tooltip');

// Character Sets
const keys = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "@!$*#%^&()-+=_[]{}|;:',.<>?/"
};

// Event Listeners
generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyToClipboard);

// Update displayed length value dynamically
lengthEl.addEventListener('input', (e) => {
    lengthValEl.innerText = e.target.value;
});

// Function to select a random character from a string
const getRandomChar = (str) => {
    return str[Math.floor(Math.random() * str.length)];
};

// Core Password Generation Function
function generatePassword() {
    const length = parseInt(lengthEl.value);
    const hasNumbers = numbersEl.checked;
    const hasSymbols = symbolsEl.checked;
    const hasUppercase = uppercaseEl.checked;

    let charset = keys.lowercase;
    const guaranteedChars = [];

    if (hasNumbers) {
        charset += keys.numbers;
        guaranteedChars.push(getRandomChar(keys.numbers));
    }
    if (hasSymbols) {
        charset += keys.symbols;
        guaranteedChars.push(getRandomChar(keys.symbols));
    }
    if (hasUppercase) {
        charset += keys.uppercase;
        guaranteedChars.push(getRandomChar(keys.uppercase));
    }

    // Always guarantee a lowercase char
    guaranteedChars.push(getRandomChar(keys.lowercase));

    let generatedPassword = "";

    // Fill with guaranteed characters first
    for(let i = 0; i < guaranteedChars.length; i++) {
        generatedPassword += guaranteedChars[i];
    }

    // Fill the rest with random characters
    const remainingLength = length - guaranteedChars.length;
    for (let i = 0; i < remainingLength; i++) {
        generatedPassword += getRandomChar(charset);
    }

    // Shuffle the password
    const shuffledPassword = generatedPassword.split('').sort(() => 0.5 - Math.random()).join('');

    // Display on screen
    displayEl.innerText = shuffledPassword;

    // Update Strength Meter
    calculateStrength(shuffledPassword, length, hasNumbers, hasSymbols, hasUppercase);
}

// Copy to Clipboard Function
function copyToClipboard() {
    const password = displayEl.innerText;
    if (password === "Click Generate ->") return;

    navigator.clipboard.writeText(password).then(() => {
        copyTooltip.classList.add('show');
        setTimeout(() => {
            copyTooltip.classList.remove('show');
        }, 1500);
    });
}

// Real-time Strength Calculation
function calculateStrength(pwd, len, num, sym, upper) {
    let score = 0;
    if (num) score++;
    if (sym) score++;
    if (upper) score++;
    if (len >= 12) score++;
    if (len >= 16) score++;
    if (len >= 24) score++;

    let width = '0%';
    let color = '--danger';
    let text = 'Weak';

    if (score <= 2) {
        width = '30%';
        color = '--danger';
        text = 'Weak';
    } else if (score <= 4) {
        width = '60%';
        color = '--warning';
        text = 'Medium';
    } else {
        width = '100%';
        color = '--success';
        text = 'Strong';
    }

    // Update UI elements
    strengthBar.style.width = width;
    strengthBar.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(color);
    strengthText.innerText = text;
    strengthText.style.color = getComputedStyle(document.documentElement).getPropertyValue(color);
}

// Initial Generation
generatePassword();