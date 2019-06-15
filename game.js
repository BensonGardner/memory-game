// timer is doubling up when you restart, at least when game is still running on click.

const symbolData = ['&#xF981', '&#xF981', ':-)', ':-)', ':-(', ':-(', 'Handlebar', 'Handlebar', 'pizza', 'pizza', 'animal', 'animal'],
      screenDarkener = document.getElementById('screenDarkener'),
      star = document.createElement('span'),
      starOutline = document.createElement('span'),
      messageBox = document.createElement('div');

// Create star and star outline nodes using unicode symbols
star.innerHTML = String.fromCodePoint(0x2605); //(0x2B50);
starOutline.innerHTML = String.fromCodePoint(0x2606); 

//Set up our win/lose message box for later
messageBox.innerHTML = '<p id="message"></p><p id="timeMessage"></p>' +
    '<p id="ratingMessage"></p><button type="button" class="reset">New Game</div>';
messageBox.style.visibility = 'hidden';
document.body.appendChild(messageBox);

let buttons = document.querySelectorAll('.reset');

let num = 0,
    cardPositions = [],
    faceUpSymbols = [],
    moves = 0,
    timer = 20000;
    gameState = 'waiting';
    starCount = 3;
    newStar = null;
    endGameInfo = 0;

// To shuffle the deck, first we create an
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
        return;
    }
};
    
function deal() {
    let symbol = '';
        cardHTML = '';
    
    // draw a div for each card
    for (const cardPosition of cardPositions) {
        //draw a div for current card
        symbol = symbolData[cardPosition];
        cardHTML = document.createElement('div');
        cardHTML.innerHTML = '<div class="card face-down"><p class="card-symbol">' + symbol + '</p></div>'; 
        
        document.querySelector('#board').appendChild(cardHTML);
    };
    
    const cards = document.querySelectorAll('.card');
    for (card of cards) {
        card.addEventListener('click', flip);
    };
};

function countdown() {
    if (timer === 0) {
        lose('Out of time!');
        return;
    } else if (gameState === 'running') {
        timer = timer - 1000;
        setTimeout(countdown, 1000);
        document.querySelector('#time').innerHTML = timer/1000;
    } else {
        return;
    };
};

function drawStars() {
    document.querySelector('#stars').innerHTML = '';
    for (i = 0; i < 3; i++) {
        if (i < starCount) {
            newStar = star.cloneNode(true);
        } else {
            newStar = starOutline.cloneNode(true);
        };
        document.querySelector('#stars').appendChild(newStar);
    }
};

function advanceMoves() {
    moves++;
    document.getElementById('moves-remaining').innerHTML = moves;
    if (moves > 0) {
        if (moves % 5 === 0) {
            starCount--;
            drawStars();
        };
    };
    if (starCount == 0) {
        lose("Out of moves!");
    };
}

function flip(e) {
    if (gameState === 'won' || gameState === 'lost') {
        return;
    } else if (gameState === 'waiting') {
        gameState = 'running';
        setTimeout(countdown, 1000);
    };
    let currentCard = e.target;
    if (currentCard.classList.contains('face-up') || document.getElementsByClassName('face-up').length > 1) {
        return;
    };
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
        faceUpSymbols = [];
        if (document.querySelectorAll('.face-down').length === 0) {
            win();
        };
    }, 250);
};

function mismatch() {
    setTimeout(function() {
        let revealedCards = document.querySelectorAll('.face-up');
        for (revealedCard of revealedCards) {
            revealedCard.classList.add('face-down');
            revealedCard.classList.remove('face-up');
        };
    }, 1000);
    faceUpSymbols = [];
};

function modal(condition, message) {
    boardHeight = document.querySelector('#board').scrollHeight;
    console.log(screenDarkener.style.height);
    console.log(screenDarkener);
    screenDarkener.style.height = boardHeight;
    console.log(screenDarkener.style.height);
    screenDarkener.style.visibility = 'visible';
    console.log(screenDarkener.style.height);
    document.getElementById('message').innerHTML = message;
    if (condition === 'win') {
        document.getElementById('timeMessage').innerHTML = 'Your time: ' + 
            timer/1000;
        document.getElementById('ratingMessage').innerHTML = 'Your rating: ' +
            document.querySelector('#stars').innerHTML;
    };
    messageBox.classList.add('modal');
    /*messageBox.style.position('absolute');
    messageBox.align-self('center');
    messageBox.top('35%');*/
    messageBox.style.visibility = 'visible';
};

function win() {
    gameState = 'won';
    modal('win', 'Congratulations! You won!');  // Maybe later feed this a template string using backticks
};

function lose(reason) {
    gameState = 'lost';
    endGameInfo = 'You lost! ' + reason;
    modal('lose', endGameInfo);
}

function startGame() {
    gameState = 'waiting';
    screenDarkener.style.visibility = 'hidden';
    document.getElementById('board').innerHTML = '';
    num = 0,
    cardPositions = [],
    faceUpSymbols = [],
    moves = 0,
    timer = 20000;
    document.querySelector('#time').innerHTML = timer/1000;
    endGameInfo = '';
    starCount = 3;
    newStar = null;
    shuffle();
    deal();
    drawStars();
    messageBox.style.visibility = 'hidden';
    for (const button of buttons) {
        button.addEventListener('click', startGame);
    };
};

startGame();

