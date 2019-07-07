// need a README
// Maybe make the reset / reset2 situation more better
// Anything else look weird?

const symbolData = ['&#xF981', '&#xF981', ':-)', ':-)', ':-(', ':-(', 'Handlebar', 'Handlebar', 'pizza', 'pizza', 'animal', 'animal'],
      screenDarkener = document.createElement('div'),
      star = document.createElement('span'),
      starOutline = document.createElement('span');

// Create star and star outline nodes using unicode symbols
star.innerHTML = String.fromCodePoint(0x2605); //(0x2B50);
starOutline.innerHTML = String.fromCodePoint(0x2606); 

let num = 0,
    cardPositions = [],
    faceUpSymbols = [],
    moves = 0,
    timer = 35000,
    gameState = 'waiting',
    starCount = 3,
    newStar = null,
    symbol = '',
    cardHTML = '',
    endGameInfo = 0,
    messages = document.createElement('div'),
    messageBox = document.createElement('div'),
    mainMessage = document.createElement('p'),
    bodyHeight = '';  

// To shuffle the deck, first we create an
// array of randomly ordered numbers, 1-12.
// This array will determine the order the
// cards are 'dealt' (drawn) on the screen.
function shuffle() {
    if (cardPositions.length < 12) {
        num = Math.round(Math.random() * 11);
        if (!cardPositions.includes(num)) {
            cardPositions.push(num);
        }
        shuffle();
    } else {
        return;
    }
}
    
function deal() {
    symbol = '';
    cardHTML = '';
    
    // draw a div for each card, in the order given by 
    // the cardPositions array, which we just shuffled.
    for (const cardPosition of cardPositions) {
        //draw a div for current card
        symbol = symbolData[cardPosition];
        cardHTML = document.createElement('div');
        cardHTML.innerHTML = '<p class="card-symbol">' + symbol + '</p>'; 
        cardHTML.classList.add('card');
        cardHTML.classList.add('face-down');
        document.querySelector('#board').appendChild(cardHTML);
    };
    
    const cards = document.querySelectorAll('.card');
    for (let card of cards) {
        card.addEventListener('click', flip);
    };
}

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
    }
}

function drawStars() {
    document.querySelector('#stars').innerHTML = '';

    // Draw either a star or the outline of a star in the
    // rating section of the page. 
    for (let i = 0; i < 3; i++) {
        if (i < starCount) {
            newStar = star.cloneNode(true);
        } else {
            newStar = starOutline.cloneNode(true);
        }
        document.querySelector('#stars').appendChild(newStar);
    }
}

function advanceMoves() {
    moves++;
    document.getElementById('moves-taken').innerHTML = moves;
    if (moves === 9 || moves === 14 || moves === 17) {
        starCount--;
        drawStars();
    }
    if (starCount == 0) {
        lose("Out of moves!");
    }
}

function flip(e) {
    
    // Don't allow cards to flip when the game is over,
    // but if the game is waiting, flipping the first card
    // triggers the game to start and the countdown to begin.
    if (gameState === 'won' || gameState === 'lost') {
        return;
    } else if (gameState === 'waiting') {
        gameState = 'running';
        setTimeout(countdown, 1000);
    }
    
    let currentCard = e.target; 
    
    // Don't allow a face-up card to be clicked
    if (currentCard.classList.contains('face-up') || document.getElementsByClassName('face-up').length > 1) {
        return;
    }
    
    // Otherwise, flip the card from face-down to face-up
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
        }
    }
}

function match() {
    
    // After a fraction of a second, gray out a matched pair
    // so they're clearly not in play
    let faceUpCards = document.querySelectorAll('.face-up');
    setTimeout(function() {
        for (let faceUpCard of faceUpCards) {
            faceUpCard.classList.add('matched');
            faceUpCard.classList.remove('face-up');
        };
        faceUpSymbols = [];
        if (document.querySelectorAll('.face-down').length === 0) {
            win();
        }
    }, 250);
}

function mismatch() {

    // After 1 second, automatically flip a mismatched
    // pair back to face-down
    setTimeout(function() {
        let revealedCards = document.querySelectorAll('.face-up');
        for (let revealedCard of revealedCards) {
            revealedCard.classList.add('face-down');
            revealedCard.classList.remove('face-up');
        };
    }, 1000);
    faceUpSymbols = [];
}

function modal(condition, message) {
    
    // Darken the screen behind the modal
    bodyHeight = document.body.scrollHeight;
    screenDarkener.classList.add('screen-darkener');
    screenDarkener.style.height = bodyHeight + 'px';
    document.querySelector('#board').prepend(screenDarkener);

    // Create the modal with customized message
    messageBox.innerHTML = '<button type="button" id="reset2">New Game</button>';
    mainMessage.innerHTML = message;
    if (condition === 'win') {
        messages.innerHTML = '<p>Your time: ' + 
            (35000 - timer)/1000 + ' seconds</p><p>Your rating: ' +
            document.querySelector('#stars').innerHTML + '</p>';
    }
    messageBox.prepend(messages);
    messageBox.prepend(mainMessage);

    // Add the modal to the document
    document.querySelector('#board').appendChild(messageBox);
    messageBox.classList.add('modal');
    messageBox.setAttribute('id', 'messageBox')
    document.querySelector('#reset2').addEventListener('click', startGame);
};

function win() {
    gameState = 'won';
    modal('win', 'Congratulations! You won!');
}

function lose(reason) {
    gameState = 'lost';
    endGameInfo = 'You lost! ' + reason;
    modal('lose', endGameInfo);
}

function startGame() {
    
    // Remove the modal and screen darkener if present
    if (document.querySelector('#messageBox')) {
        document.querySelector('#messageBox').remove();
    }
    if (screenDarkener.parentElement === document.body) {
        document.body.removeChild(screenDarkener);
    }
    
    // Set values and board state back to starting positions
    gameState = 'waiting';
    document.getElementById('board').innerHTML = '';
    num = 0;
    cardPositions = [];
    faceUpSymbols = [];
    moves = 0;
    timer = 35000;
    document.querySelector('#time').innerHTML = timer/1000;
    document.getElementById('moves-taken').innerHTML = moves;
    endGameInfo = '';
    starCount = 3;
    newStar = null;
    shuffle();
    deal();
    drawStars();
    document.querySelector('#reset').addEventListener('click', startGame);
}

startGame();