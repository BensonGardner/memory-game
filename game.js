let num = 0;

const symbolData = ['&#xF981', '&#xF981', ':-)', ':-)', ':-(', ':-(', 'Handlebar', 'Handlebar', 'pizza', 'pizza', 'animal', 'animal'];

let cardPositions = [],
    faceUpSymbols = [],
    moves = 0,
    timer = 180000;

// Shuffle the deck: create an
// array of randomly ordered numbers, 1-12.
// This array will determine the order the
// cards are 'dealt' (drawn) on the screen.
function shuffle() {
    if (cardPositions.length < 12) {
        num = Math.round(Math.random() * 11) + 1;
        if (!cardPositions.includes(num)) {
            cardPositions.push(num);
        };
        shuffle();
    } else {
        console.log(cardPositions);
        return;
    }
};
    
function deal() {
    let symbol = '';
        cardHTML = '';
    
    // draw a div for each card
    for (const cardPosition of cardPositions) {
        //draw a div for current card
        index = cardPositions[cardPosition];
        symbol = symbolData[index];
        cardHTML = document.createElement('div');
        cardHTML.innerHTML = '<div class="card face-down"><p class="card-symbol">' + symbol + '</p></div>'; 
        
        document.querySelector('.board').appendChild(cardHTML);
    };
    
    const cards = document.querySelectorAll('.card');
    for (card of cards) {
        card.addEventListener('click', flip);
    };
};

function countdown() {
    if (timer = 0) {
        return;
    };
    timer = timer - 1000;
    setTimeout(countdown, 1000);
    document.querySelector('#time').innerHTML = timer;
};

function drawStars() {
    for (i = 0; i < starCount; i++) {   
        document.querySelector('#stars').innerHTML = 0x2B50;
    }
};

function flip(e) {
    console.log(e.target);
    let currentCard = e.target;
    if (e.target.classList.contains('face-up')) {
        return;
    };
    moves++;
    document.getElementById('moves-remaining').innerHTML = moves;
    if (moves % 5 === 0) {
        if (starCount > 1) {
            starCount = starCount - 1;
            drawStars();
        };
    };
    console.log(currentCard);
    currentCard.classList.remove('face-down');
    currentCard.classList.add('face-up');
    
    // Store the symbol on the flipped-over card
    symbol = currentCard.getElementsByTagName('p')[0].innerHTML;
    
    // If there's a face up card with a matching
    // symbol, run the match() function. If there's
    // any other face up card, run mismatch(). If there
    // aren't any face up cards, simply add this card's
    // symbol to the array of faceUpSymbols.
    if (symbol === faceUpSymbols[0]) {
        match();
    } else if (faceUpSymbols[0]) {
        mismatch();
    } else {
        faceUpSymbols.push(symbol);
    };
}

function match() {
    document.querySelectorAll('.face-up').addClass('matched');
    document.querySelectorAll('.matched').removeClass('face-up');
    // modal
    faceUpSymbols = [];
    if (document.querySelectorAll('.face-down').length === 0) {
        win();
    };
};

function mismatch() {
    // modal
    setTimeout(function() {
        let revealedCards = document.querySelectorAll('.face-up');
        for (revealedCard of revealedCards) {
            revealedCard.classList.add('face-down');
        };
        // NOPE! We have to make sure that when ccards are matched, they have the face-up class removed and replaced with a "matched" class which would also show what's on the card but would avoid them being turned face down again later on.
        let cardsWithFaceDown = document.querySelectorAll('.face-down');
        for (cardWithFaceDown of cardsWithFaceDown) {
             cardWithFaceDown.classList.remove('face-up');
        };
    }, 1000);
}

function win() {
    // stop counter
    // modal , reporting star score.  
    // Maybe put a reset button in the modal
}

function startGame() {
    console.log('start game');
    let num = 0,
        cardPositions = [],
        faceUpSymbols = [],
        moves = 0,
        timer = 180000;
        starCount = 3;
        shuffle();
        deal();
        document.getElementById('reset').addEventListener('click', startGame);
        setTimeout(countdown, 1000);
        drawStars();
};

startGame();
