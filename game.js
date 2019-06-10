let num = 0;

const symbolData = ['&#xF981', '&#xF981', ':-)', ':-)', ':-(', ':-(', 'Handlebar', 'Handlebar', 'pizza', 'pizza', 'animal', 'animal'];

let cardPositions = [],
    faceUpSymbols = [],
    moves = 0,
    timer = 60000;

const star = document.createElement('span');
star.innerHTML = 0x2B50;

// Shuffle the deck: create an
// array of randomly ordered numbers, 1-12.
// This array will determine the order the
// cards are 'dealt' (drawn) on the screen.
function shuffle() {
    if (cardPositions.length < 12) {
        num = Math.round(Math.random() * 11);
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
        index = cardPosition;
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
    if (timer === 0) {
        return;
    };
    timer = timer - 1000;
    setTimeout(countdown, 1000);
    document.querySelector('#time').innerHTML = timer;
};

function drawStars() {
    for (i = 0; i < starCount; i++) {   
        // the utf code isn't making a star, it's making "11088"    
        
        document.querySelector('#stars').append(star);
    }
};

function advanceMoves() {
    moves++;
    document.getElementById('moves-remaining').innerHTML = moves;
    // this little bit could probably just be a switch
    // for if moves is 10, 15, 20
    if (moves % 10 === 0) {
        if (starCount > 1) {
            starCount = starCount - 1;
            drawStars();
        };
    };
}

function flip(e) {
    console.log(e.target);
    let currentCard = e.target;
    if (currentCard.classList.contains('face-up') || document.getElementsByClassName('face-up').length > 1) {
        return;
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
        advanceMoves();
        match();
    } else {
        if (faceUpSymbols[0]) {
            advanceMoves();
            mismatch();
        } else {
            faceUpSymbols.push(symbol);
        };
    }
};

function match() {
    let faceUpCards = document.querySelectorAll('.face-up');
    setTimeout(function() {
        for (faceUpCard of faceUpCards) {
            faceUpCard.classList.add('matched');
            faceUpCard.classList.remove('face-up');
        }
        // modal    
        faceUpSymbols = [];
        if (document.querySelectorAll('.face-down').length === 0) {
            win();
        };

    }, 250);
};

function mismatch() {
    // modal
    setTimeout(function() {
        let revealedCards = document.querySelectorAll('.face-up');
        for (revealedCard of revealedCards) {
            revealedCard.classList.add('face-down');
            revealedCard.classList.remove('face-up');
        };
    }, 1000);
    faceUpSymbols = [];
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
        timer = 60000;
        starCount = 3;
        shuffle();
        deal();
        document.getElementById('reset').addEventListener('click', startGame);
        setTimeout(countdown, 1000);
        drawStars();
};

startGame();
