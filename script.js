// Odkazy na HTML prvky
const mainMenu = document.getElementById('mainMenu');
const startButton = document.getElementById('startButton');
const leaderboardButton = document.getElementById('leaderboardButton');
const gameArea = document.getElementById('gameArea');
const gameContainer = document.getElementById('gameContainer');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const gameOver = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const backToMenuButton = document.getElementById('backToMenuButton');
const leaderboard = document.getElementById('leaderboard');
const leaderboardList = document.getElementById('leaderboardList');
const backFromLeaderboard = document.getElementById('backFromLeaderboard');
const submitScoreButton = document.getElementById('submitScoreButton');
const playerNameInput = document.getElementById('playerName');

// Herní proměnné
let score = 0;
let timeLeft = 30; // sekund
let timerInterval;
let gameActive = false;

// Funkce pro start hry
function startGame() {
    console.log('Start Game');
    mainMenu.classList.add('hidden');
    leaderboard.classList.add('hidden');
    gameOver.classList.add('hidden');
    gameArea.classList.remove('hidden');
    resetGame();
    // Přidáme krátkou pauzu, aby se layout aktualizoval
    setTimeout(() => {
        const containerWidth = gameContainer.offsetWidth;
        const containerHeight = gameContainer.offsetHeight;
        console.log(`GameContainer size: ${containerWidth}x${containerHeight}`);
        if (containerWidth > 0 && containerHeight > 0) {
            spawnTargets(5); // Počáteční počet cílů
            startTimer();
            gameActive = true;
            console.log('Game started successfully.');
        } else {
            console.error('GameContainer má nulové rozměry.');
            endGame();
        }
    }, 100); // 100ms pauza
}

// Funkce pro restart hry
function restartGame() {
    console.log('Restart Game');
    gameOver.classList.add('hidden');
    gameArea.classList.remove('hidden'); // Zajistí zobrazení herní oblasti
    resetGame();
    spawnTargets(5); // Spustí nové cíle
    startTimer();
    gameActive = true;
    console.log('Game restarted successfully.');
}

// Funkce pro návrat do hlavního menu z konce hry
function backToMenu() {
    gameOver.classList.add('hidden');
    mainMenu.classList.remove('hidden');
}

// Funkce pro reset hry
function resetGame() {
    console.log('Reset Game');
    score = 0;
    timeLeft = 30;
    scoreElement.textContent = `Skóre: ${score}`;
    timerElement.textContent = `Čas: ${timeLeft}`;
    gameContainer.innerHTML = '';
}

// Funkce pro spuštění časovače
function startTimer() {
    console.log('Start Timer');
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Čas: ${timeLeft}`;
        console.log(`Time left: ${timeLeft}`);
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Funkce pro ukončení hry
function endGame() {
    clearInterval(timerInterval);
    gameActive = false;
    gameArea.classList.add('hidden');
    gameOver.classList.remove('hidden');
    finalScore.textContent = score;
    console.log('End Game');
}

// Funkce pro vytvoření a umístění cílového objektu
function spawnTargets(number) {
    console.log(`Spawning ${number} targets`);
    for (let i = 0; i < number; i++) {
        createTarget();
    }
}

// Funkce pro vytvoření jednoho cílového objektu
function createTarget() {
    const containerRect = gameContainer.getBoundingClientRect();
    console.log(`GameContainer size: ${containerRect.width}x${containerRect.height}`);
    if (containerRect.width === 0 || containerRect.height === 0) {
        console.error('GameContainer má nulové rozměry.');
        return;
    }

    const target = document.createElement('div');
    target.classList.add('target');

    // Náhodná pozice uvnitř gameContainer
    const x = Math.random() * (containerRect.width - 40);
    const y = Math.random() * (containerRect.height - 40);

    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

    // Rozhodnutí, zda bude cíl pohyblivý (20% pravděpodobnost)
    if (Math.random() < 0.2) {
        target.classList.add('movable');
    }

    // Přidání event listeneru pro kliknutí
    target.addEventListener('click', () => {
        if (!gameActive) return;
        score++;
        scoreElement.textContent = `Skóre: ${score}`;
        gameContainer.removeChild(target);
        createTarget(); // Vytvoření nového cíle
        console.log(`Target clicked. New score: ${score}`);
    });

    gameContainer.appendChild(target);
    console.log('Target created and appended');
}

// Funkce pro uložení skóre do leaderboardu
function saveScore(name, score) {
    let leaderboardData = JSON.parse(localStorage.getItem('quickSightLeaderboard')) || [];
    leaderboardData.push({ name, score });
    // Seřadíme skóre sestupně a uchováme jen top 10
    leaderboardData.sort((a, b) => b.score - a.score);
    leaderboardData = leaderboardData.slice(0, 10);
    localStorage.setItem('quickSightLeaderboard', JSON.stringify(leaderboardData));
}

// Funkce pro zobrazení leaderboardu
function showLeaderboard() {
    console.log('Show Leaderboard');
    mainMenu.classList.add('hidden');
    gameArea.classList.add('hidden');
    gameOver.classList.add('hidden');
    leaderboard.classList.remove('hidden');
    displayLeaderboard();
}

// Funkce pro skrytí leaderboardu a návrat do menu
function hideLeaderboard() {
    leaderboard.classList.add('hidden');
    mainMenu.classList.remove('hidden');
}

// Funkce pro zobrazení leaderboardu
function displayLeaderboard() {
    leaderboardList.innerHTML = ''; // Vyčistíme předchozí seznam
    const leaderboardData = JSON.parse(localStorage.getItem('quickSightLeaderboard')) || [];
    leaderboardData.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}

// Funkce pro odeslání skóre do leaderboardu
function submitScore() {
    const playerName = playerNameInput.value.trim();
    if (playerName === '') {
        alert('Prosím, zadejte své jméno.');
        return;
    }
    saveScore(playerName, score);
    playerNameInput.value = '';
    showLeaderboard();
}

// Přidání posluchačů na tlačítka
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
backToMenuButton.addEventListener('click', backToMenu);
leaderboardButton.addEventListener('click', showLeaderboard);
backFromLeaderboard.addEventListener('click', hideLeaderboard);
submitScoreButton.addEventListener('click', submitScore);

// Zobrazení hlavního menu při načtení stránky
window.onload = () => {
    console.log('Page Loaded');
    mainMenu.classList.remove('hidden');
    gameArea.classList.add('hidden');
    gameOver.classList.add('hidden');
    leaderboard.classList.add('hidden');
};
