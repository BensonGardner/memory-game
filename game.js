let num = 0;

const symbolData = ['&#xF981', '&#xF981', ':-)', ':-)', ':-(', ':-(', 'Handlebar', 'Handlebar', 'pizza', 'pizza', 'animal', 'animal'];

let cardOrder = [],
    faceUpSymbols = [],
    moves = 0,
    timer = 180000;

// Shuffle the deck: create an
// array of randomly ordered numbers, 1-12.
// This array will determine the order the
// cards are 'dealt' (drawn) on the screen.
function shuffle() {
    if (data.cardOrder.length < 12) {
        num = Math.random() * 12;
        if (!data.cardOrder.find(num)) {
            data.cardOrder.append(num);
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
    for (const card of cardOrder) {
        //draw a div for current card
        index = cardOrder[card];
        symbol = symbolData[index];
        cardHTML = '<div class="card face-down"><p class="card-symbol">' + 
            symbol + '</p></div>'; 
        
        document.querySelector('.board').appendChild(cardHTML);
    };
    
    document.querySelectorAll('.card').addEventListener('click', flip());
};

function countdown() {
    timer = timer - 1000;
    setTimeout(countdown, 1000);
    document.querySelector('#time').innerHTML = timer;
};

function drawStars() {
    for (i = 0; i < starCount; i++) {   
        document.querySelector('#stars').innerHTML = 0x2B50;
    }
};

function flip() {
    if (this.hasClass('face-up')) {
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
    this.removeClass('face-down');
    this.addClass('face-up');
    
    // Store the symbol on the flipped-over card
    symbol = this.getElementsByTagName('p')[0].innerHTML;
    
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
    document.querySelectorAll('.face-up').addClass('face-down');
    document.querySelectorAll('.face-down').removeClass('face-up');
};

function win() {
    // stop counter
    // modal , reporting star score.  
    // Maybe put a reset button in the modal
}

function startGame() {
    console.log('start game');
    let num = 0,
        cardOrder = [],
        faceUpSymbols = [],
        moves = 0,
        timer = 180000;
        starCount = 3;
        shuffle();
        deal();
        document.getElementbyId('reset').addEventListener('click', startGame);
        setTimeout(countdown, 1000);
        drawStars();
};

startGame();
