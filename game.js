const symbolData = ['&#xF981', '&#xF981', ':-)', ':-)', ':-(', ':-(', 'Handlebar', 'Handlebar', 'pizza', 'pizza', 'animal', 'animal'],
      screen = document.getElementById('screen');

let num = 0,
    cardPositions = [],
    faceUpSymbols = [],
    moves = 0,
    timer = 45000;
    gameOver = false;
    starCount = 3;
    newStar = null;
    endGameInfo = 0;

const star = document.createElement('span');
star.innerHTML = String.fromCodePoint(0x2B50);

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
        
        document.querySelector('#board').appendChild(cardHTML);
    };
    
    const cards = document.querySelectorAll('.card');
    for (card of cards) {
        card.addEventListener('click', flip);
    };
};

function countdown() {
    if (gameOver === true) {
        return;
    }
    if (timer === 0) {
        lose('Out of time!');
        return;
    };
    timer = timer - 1000;
    setTimeout(countdown, 1000);
    document.querySelector('#time').innerHTML = timer/1000;
};

function drawStars() {
    document.querySelector('#stars').innerHTML = '';
    for (i = 0; i < starCount; i++) {
        newStar = star.cloneNode(true);
        document.querySelector('#stars').appendChild(newStar);
    }
};

function advanceMoves() {
    moves++;
    document.getElementById('moves-remaining').innerHTML = moves;
    // this little bit could probably just be a switch
    // for if moves is 10, 15, 20
    console.log(starCount);
    console.log(moves % 5);
    
    if (moves > 0) {
        if (moves % 5 === 0) {
            starCount--;
            drawStars();
        };
    };
    if (starCount == 0) {
        lose("Out of moves!");
    };
    console.log(starCount);
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
};

function modal(message) {
    docHeight = document.body.clientHeight;
    screen.style.height = docHeight;
    screen.style.visibility = 'visible';
    let messageBox = document.createElement('div');
    document.getElementById('board').appendChild(messageBox);
    messageBox.classList.add('modal');
    messageBox.innerHTML = '<p>' + message + '</p>'; // try the template string 
                                                      // after verifying this works. 
};

function win() {
    gameOver = true;
    modal('Congratulations! You won!');  // Maybe later feed this a template string using backticks
    // modal , reporting star score.  
    // Maybe put a reset button in the modal
};

function lose(reason) {
    gameOver = true;
    endGameInfo = 'You lost! ' + reason;
    modal(endGameInfo);
    console.log(document.getElementById('screen'));
     // modal , you lost with the reason
    // Maybe put a reset button in the modal
}

function startGame() {
    console.log('start game');
    let num = 0,
        cardPositions = [],
        faceUpSymbols = [],
        moves = 0,
        timer = 45000;
        gameOver = false;
        endGameInfo = '';
        starCount = 3;
        newStar = null;
        shuffle();
        deal();
        document.getElementById('reset').addEventListener('click', startGame);
        setTimeout(countdown, 1000);
        drawStars();
};

startGame();

