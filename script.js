document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('#game-board');
    const startButton = document.getElementById('start-game');
    const resetButton = document.getElementById('reset-game');
    const playAgainButton = document.getElementById('play-again');
    const gameStats = document.getElementById('game-stats');
    const successMessage = document.getElementById('success-message');
    const movesCount = document.getElementById('moves-count');
    const matchesCount = document.getElementById('matches-count');
    const timer = document.getElementById('timer');

    let cardsChosen = [];
    let cardsChosenId = [];
    let cardsWon = [];
    let moves = 0;
    let matches = 0;
    let startTime;
    let timerInterval;
    let gameStarted = false;

    const cardArray = [
        { name: 'card1', img: 'images/distracted.png' },
        { name: 'card1', img: 'images/distracted.png' },
        { name: 'card2', img: 'images/drake.png' },
        { name: 'card2', img: 'images/drake.png' },
        { name: 'card3', img: 'images/fine.png' },
        { name: 'card3', img: 'images/fine.png' },
        { name: 'card4', img: 'images/rollsafe.png' },
        { name: 'card4', img: 'images/rollsafe.png' },
        { name: 'card5', img: 'images/success.png' },
        { name: 'card5', img: 'images/success.png' }
    ];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createBoard() {
        const shuffledCards = shuffle([...cardArray]);
        grid.innerHTML = '';
        cardsWon = [];
        cardsChosen = [];
        cardsChosenId = [];
        moves = 0;
        matches = 0;
        
        updateStats();

        shuffledCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.setAttribute('data-id', index);
            
            const img = document.createElement('img');
            img.setAttribute('src', card.img);
            img.setAttribute('alt', card.name);
            
            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back');
            cardBack.textContent = '🎭';
            
            cardElement.appendChild(img);
            cardElement.appendChild(cardBack);
            cardElement.addEventListener('click', flipCard);
            
            grid.appendChild(cardElement);
        });
    }

    function flipCard() {
        if (!gameStarted) return;
        
        const cardId = this.getAttribute('data-id');
        
        if (cardsChosenId.includes(cardId) || this.classList.contains('matched')) {
            return;
        }
        
        this.classList.add('show');
        this.classList.add('flipped');
        
        cardsChosen.push(cardArray[cardId].name);
        cardsChosenId.push(cardId);
        
        if (cardsChosen.length === 2) {
            moves++;
            updateStats();
            setTimeout(checkForMatch, 600);
        }
    }

    function checkForMatch() {
        const cards = document.querySelectorAll('.card');
        const firstCardId = cardsChosenId[0];
        const secondCardId = cardsChosenId[1];
        const firstCard = cards[firstCardId];
        const secondCard = cards[secondCardId];

        if (cardsChosen[0] === cardsChosen[1] && firstCardId !== secondCardId) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);
            cardsWon.push(cardsChosen);
            matches++;
            updateStats();
        } else {
            firstCard.classList.remove('show', 'flipped');
            secondCard.classList.remove('show', 'flipped');
        }

        cardsChosen = [];
        cardsChosenId = [];

        if (cardsWon.length === cardArray.length / 2) {
            setTimeout(() => {
                endGame();
            }, 500);
        }
    }

    function startGame() {
        gameStarted = true;
        startTime = Date.now();
        startTimer();
        createBoard();
        
        document.querySelector('.instructions').style.display = 'none';
        startButton.classList.add('game-hidden');
        resetButton.classList.remove('game-hidden');
        gameStats.classList.remove('game-hidden');
        grid.classList.remove('game-hidden');
    }

    function resetGame() {
        gameStarted = false;
        clearInterval(timerInterval);
        
        document.querySelector('.instructions').style.display = 'block';
        startButton.classList.remove('game-hidden');
        resetButton.classList.add('game-hidden');
        gameStats.classList.add('game-hidden');
        grid.classList.add('game-hidden');
        successMessage.classList.remove('show');
    }

    function endGame() {
        gameStarted = false;
        clearInterval(timerInterval);
        successMessage.classList.add('show');
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    function updateStats() {
        movesCount.textContent = moves;
        matchesCount.textContent = matches;
    }

    // Event listeners
    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);
    playAgainButton.addEventListener('click', () => {
        successMessage.classList.remove('show');
        resetGame();
    });

    // Add some visual feedback for card interactions
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('card') && gameStarted) {
            e.target.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.target.style.transform = '';
            }, 150);
        }
    });
});