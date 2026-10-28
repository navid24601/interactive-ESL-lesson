// Sidebar Toggle Function
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("sidebar-overlay");
    
    if (sidebar.classList.contains("expanded")) {
        sidebar.classList.remove("expanded");
        overlay.style.display = "none";
    } else {
        sidebar.classList.add("expanded");
        overlay.style.display = "block";
    }
}

// Updated Audio Function - plays specific file path
function playAudio(path) {
    // Create a new audio object for immediate playback
    // This prevents the need for 18 hidden audio tags
    var audio = new Audio(path);
    audio.play().catch(function(error) {
        console.log("Audio playback failed: " + error);
        alert("Audio file not found or playback blocked: " + path);
    });
}

// Standard Check Answers (Strict Match)
function checkAnswers(button) {
    const container = button.parentElement;
    const inputs = container.querySelectorAll('.interactive-input');
    const feedback = container.querySelector('.feedback');
    
    let allCorrect = true;

    inputs.forEach(input => {
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = input.getAttribute('data-answer').toLowerCase();

        // Check if user answer is included in correct answer or matches exactly
        // We use strict match for letters/one-word answers to be safe
        if (userAnswer === correctAnswer) {
            input.style.borderColor = "green";
            input.style.backgroundColor = "#e8f5e9";
        } else {
            input.style.borderColor = "red";
            input.style.backgroundColor = "#ffebee";
            allCorrect = false;
        }
    });

    if (allCorrect) {
        feedback.textContent = "Great job! All correct. 🎉";
        feedback.className = "feedback correct";
    } else {
        feedback.textContent = "Some answers are incorrect. Try again!";
        feedback.className = "feedback incorrect";
    }
}

// Flexible Check Answers (Keywords) - For Reading Comprehension
function checkFlexAnswers(button) {
    const container = button.parentElement;
    const inputs = container.querySelectorAll('.interactive-input');
    const feedback = container.querySelector('.feedback');
    
    let allCorrect = true;

    inputs.forEach(input => {
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswerKey = input.getAttribute('data-answer').toLowerCase();

        // Allow if the user's sentence contains the key phrase
        if (userAnswer.includes(correctAnswerKey) && userAnswer.length > 0) {
            input.style.borderColor = "green";
            input.style.backgroundColor = "#e8f5e9";
        } else {
            input.style.borderColor = "red";
            input.style.backgroundColor = "#ffebee";
            allCorrect = false;
        }
    });

    if (allCorrect) {
        feedback.textContent = "Great job! Your answers contain the correct details. 🎉";
        feedback.className = "feedback correct";
    } else {
        feedback.textContent = "Some answers seem missing key details. Try again!";
        feedback.className = "feedback incorrect";
    }
}

// --- NEW SHOW ANSWERS FUNCTION ---
function showAnswers(button) {
    const container = button.parentElement;
    const inputs = container.querySelectorAll('.interactive-input');
    
    inputs.forEach(input => {
        // Set the value to the correct answer stored in data-answer
        input.value = input.getAttribute('data-answer');
        
        // Clear any previous validation styles so it looks neutral
        input.style.borderColor = "";
        input.style.backgroundColor = "";
    });
    
    // Clear feedback text
    const feedback = container.querySelector('.feedback');
    if(feedback) {
        feedback.textContent = "Answers revealed.";
        feedback.className = "feedback";
        feedback.style.color = "var(--primary-color)";
    }
}

// --- GAME TIME LOGIC ---
const targetWords = [
    'afford', 'balance', 'bargain', 'change', 'charge', 'credit', 
    'currency', 'debt', 'discount', 'expense', 'luxury', 'overpriced', 
    'owe', 'product', 'return', 'stall', 'tax', 'worth'
];

let gameTimer;
let timeLeft = 30;

function startGame() {
    const inputArea = document.getElementById('game-input');
    const startBtn = document.getElementById('start-game-btn');
    const resultArea = document.getElementById('game-result');
    const timerDisplay = document.getElementById('timer-display');

    // Reset state
    timeLeft = 30;
    inputArea.value = '';
    inputArea.disabled = false;
    inputArea.focus();
    startBtn.disabled = true;
    resultArea.style.display = 'none';
    timerDisplay.textContent = timeLeft;

    // Start Timer
    gameTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(gameTimer);
    const inputArea = document.getElementById('game-input');
    const startBtn = document.getElementById('start-game-btn');
    const resultArea = document.getElementById('game-result');
    
    inputArea.disabled = true;
    startBtn.disabled = false;

    // Calculate Score
    const userText = inputArea.value.toLowerCase();
    // Split by non-word characters (spaces, commas, newlines)
    const userWords = userText.split(/[\s,.]+/);
    
    const foundWords = [];
    
    userWords.forEach(word => {
        if (targetWords.includes(word) && !foundWords.includes(word)) {
            foundWords.push(word);
        }
    });

    resultArea.innerHTML = `
        <p><strong>Time's up!</strong></p>
        <p>You found <strong>${foundWords.length}</strong> correct words:</p>
        <p style="color: green;">${foundWords.join(', ')}</p>
    `;
    resultArea.style.display = 'block';
}