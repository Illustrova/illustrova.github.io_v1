// A set of all possible cards
const allCards = [
	'girl1',
	'girl2',
	'girl3',
	'girl4',
	'man',
	'girl5',
	'girl7',
	'girl8',
	'girl9',
	'girl10',
	'girl11',
	'girl6'
];

/*SELECT ELEMENTS
*********************/
//Deck
const deck = document.getElementById('deck');

//Widgets
const timer = document.getElementById('timer');

const moves = document.getElementById('moves-in');
const movesOut = document.getElementById('moves-out');

const stars = document.querySelectorAll('#star-rating .star');
const starRating = document.querySelector('#star-rating .stars-container');

const rangeInput = document.getElementById('cards-input');

const btnRestart = document.getElementById('restart');

//Dialogs
const restartDialog = document.getElementById('restart-dialog');
const confirmRestart = document.getElementById('btn-restart');
const confirmCancel = document.getElementById('btn-cancel');

const winDialog = document.getElementById('win-dialog');
const totalMoves = document.getElementById('total-moves');
const totalTime = document.getElementById('total-time');
const totalStars = document.getElementById('total-stars');
const playBtn = document.getElementById('play');

//Declare global variables
let cardsAmount;
let openedCards;
let matches;
let currStars;
let interval;
let second;
let minute;
let hour;

//Register dialog elements for polyfill
dialogPolyfill.registerDialog(restartDialog);
dialogPolyfill.registerDialog(winDialog);

/* LISTENERS
************************/
//Check and update cards, star rating and moves counter on every click inside deck
deck.addEventListener('click', function(evt) {
	evt.preventDefault();
	if (evt.target.classList.contains('card-front')) {
		evt.target.parentNode.classList.add('flip');
		openedCards++;
		handleCards(openedCards, evt);
		addMove(openedCards);
		handleStars(openedCards);
		if (matches === cardsAmount / 2) {
			endGame();
		}
	}
});

//Show dialog on click on restart button
btnRestart.addEventListener('click', function(evt) {
	evt.preventDefault();
	if (openedCards > 0) {
		restartDialog.showModal();
	}
});

//Level range input - display value, and ask for confirmation to start new game, if the current game is already started.
rangeInput.addEventListener('input', displayRangeValue);
rangeInput.addEventListener('change', function() {
	if (openedCards > 0) {
		restartDialog.showModal();
	} else {
		startGame();
	}
});

//DIALOGS
//Restart Game dialog
//Cancel button - close dialog and do nothing
confirmCancel.addEventListener('click', function() {
	restartDialog.close();
});
//Confirm button - restart game
confirmRestart.addEventListener('click', function() {
	restartDialog.close();
	startGame();
});
//Win dialog
//Play again button - close ddialog and start new game
playBtn.addEventListener('click', function() {
	winDialog.close();
	startGame();
});

/* FUNCTIONS
***********************/
//Update range input value and level name
function displayRangeValue() {
	let newValue = rangeInput.value;
	const output = document.getElementById('cards-output');
	const level = document.getElementById('level-output');
	output.innerHTML = newValue;

	switch (newValue) {
		case '12':
			level.innerHTML = 'Easy';
			level.classList = 'easy';
			break;
		case '16':
			level.innerHTML = 'Medium';
			level.classList = 'medium';
			break;
		case '20':
			level.innerHTML = 'Difficult';
			level.classList = 'difficult';
			break;
		case '24':
			level.innerHTML = 'Come on!';
			level.classList = 'impossible';
			break;
		default:
			break;
	}
}

//Cards
/**
* @param {number} openedCards - Current number of opened cards (aka moves)
* @param {object} evt - Current event
*/
function handleCards(openedCards, evt) {
	if (openedCards === 1) {
		startTimer();
	}
	if (openedCards % 2 === 0) {
		const secondCard = evt.target.parentNode;
		if (isMatch(firstCard, secondCard)) {
			removeMatch(firstCard, secondCard);
			matches++;
		} else {
			noMatch(firstCard, secondCard);
		}
	} else {
		firstCard = evt.target.parentNode;
	}
	if (matches * 2 === cardsAmount - 2) {
		const remainedCards = document.querySelectorAll('.card:not(.flip)');
		for (let i = 0; i < remainedCards.length; i++) {
			remainedCards[i].classList.add('flip');
			remainedCards[i].classList.add('match');
		}
		matches++;
	}
}

function isMatch(card1, card2) {
	let use1 = card1.querySelector('.solid-image use');
	let use2 = card2.querySelector('.solid-image use');
	if (use1.getAttribute('xlink:href') === use2.getAttribute('xlink:href')) {
		return true;
	}
	return false;
}
let firstCard;

function removeMatch(firstCard, secondCard) {
	firstCard.classList.add('match');
	secondCard.classList.add('match');
	// firstCard.removeChild(firstCard.firstChild);
	// secondCard.removeChild(secondCard.firstChild);
}

function noMatch(firstCard, secondCard) {
	setTimeout(function() {
		firstCard.classList.remove('flip');
		secondCard.classList.remove('flip');
	}, 1500);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

//Moves
function addMove(value) {
	moves.textContent = value;
	movesOut.classList.add('out');
	moves.classList.add('out');

	setTimeout(function() {
		movesOut.textContent = value;
		movesOut.classList.remove('out');
		moves.classList.remove('out');
	}, 800);
}

//Stars
function handleStars(moves) {
	switch (moves) {
		case 24:
		case 30:
		case 36:
			removeStar(--currStars);
			break;
		default:
			break;
	}
}

function removeStar(starindex) {
	stars[starindex].classList.add('inactive');
}

//Timer
function startTimer() {
	interval = setInterval(function() {
		second++;
		timer.textContent =
			(hour ? addZero(hour) + ' : ' : '') +
			addZero(minute) +
			' : ' +
			addZero(second);

		if (second === 60) {
			minute++;
			second = 0;
		}
		if (minute === 60) {
			hour++;
			minute = 0;
		}
	}, 1000);
}

// Set timer at 00:00
function resetTimer() {
	clearInterval(interval);
	second = 0;
	minute = 0;
	hour = 0;
	timer.textContent = '00 : 00';
}

//Add zero to unify number format
function addZero(number) {
	return ('0' + number).slice(-2);
}

//Game
function startGame() {
	resetGame();

	// get number of cards in deck
	cardsAmount = rangeInput.value;

	//get needed amount of cards, double them and shuffle
	const cardsSetUnique = allCards.slice(0, cardsAmount / 2);
	const cardsSet = cardsSetUnique.concat(cardsSetUnique);
	shuffle(cardsSet);

	//add deck class reflecting number of cards
	deck.classList.add('deck-' + cardsAmount);

	//Create container for the cards
	let fragment = document.createElement('div');
	fragment.setAttribute('id', 'deck-wrapper');

	//Create cards
	cardsSet.forEach(function(card) {
		//create card markup
		let li = document.createElement('li');
		li.className = 'card';
		let cardFront = document.createElement('div');
		cardFront.className = 'card-front';
		let cardBack = document.createElement('div');
		cardBack.className = 'card-back';

		const basesvg = document
			.getElementsByClassName('basesvg')[0]
			.cloneNode(true);

		let useTags = basesvg.getElementsByTagName('use');
		for (let i = 0; i < useTags.length; i++) {
			useTags[i].setAttributeNS(
				'http://www.w3.org/1999/xlink',
				'xlink:href',
				'#' + card
			);
		}
		cardBack.appendChild(basesvg);
		li.innerHTML = cardFront.outerHTML + cardBack.outerHTML;
		fragment.appendChild(li);
	});

	//append cards to deck
	deck.appendChild(fragment);

	//animate new game start
	setTimeout(function() {
		deck.classList.add('deck-appear');
	}, 10);
}

startGame();

//Reset cards and progress
function resetGame() {
	//Reset moves counter
	openedCards = 0;
	addMove(openedCards);

	matches = 0;

	//Remove deck extra classes
	deck.classList = 'deck';

	//remove all cards
	if (deck.firstChild) {
		deck.removeChild(deck.firstChild);
	}

	resetTimer();

	//reset star rating
	currStars = 3;
	for (var i = 0; i < stars.length; i++) {
		stars[i].classList.remove('inactive');
	}

	//cleanup star rating in results modal
	while (totalStars.firstChild) {
		totalStars.removeChild(totalStars.firstChild);
	}
}

function endGame() {
	clearInterval(interval);
	totalTime.textContent =
		(hour ? addZero(hour) + ' : ' : '') +
		addZero(minute) +
		' : ' +
		addZero(second);
	totalMoves.textContent = openedCards;
	const starsCopy = starRating.cloneNode(true);
	totalStars.appendChild(starsCopy);
	setTimeout(function() {
		winDialog.showModal();
	}, 0);

}