////////////
////13.12.2017
//  The date skynet took over the humanity,
//  our only salvation lies in this memory game.
///////////
// Jk, I've decided to tidy up the code, put everything into
// meaningful functions.
 
/*
 * Variables
 */
 
const card_list = ["diamond","paper-plane-o","anchor","bolt","cube","leaf","bicycle","bomb"];

var opened_cards = [];

var matched_cards = [];

var moves = 0;

var stars = 3;

var timeExecute = false;

var timeRestart = false;

var timeUpdate = true;
  

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/* Time function FINALLY! 
 * https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
 * Link provided me how to create a timer.
 *
 * timer is called many times, thus to prevent it starting again and again
 * we check wheter the timer is executed or not.
 * then timer updates itself per second, if timeUpdate is true.
 * 
 * timeRestart is used to stop the timer and restart the time to initial 00:00
 *
 */
function timer(){
	
	if (!timeExecute)
	{
		timeExecute = true;
		var startGame = Date.now();
		var clocker = setInterval(function() 
			{
			var delta = Date.now() - startGame;
			var sec = Math.floor(delta / 1000);
			
			var second = sec % 60;
			var minute = (Math.floor(sec/60)) % 60;
			
			if (second < 10){
				second = "0" + second;
			}
			if (minute < 10){
				minute = "0" + minute;
			}
					
			var gameTime = " " + minute + ":" + second;
			
			if (timeUpdate){
				$(".timey").text(gameTime);
			}
			
			if(timeRestart){
				clearInterval(clocker);
				timeRestart = false;
				$('.timey').text(" 00:00")
			}
			
			}, 1000);
	}
}

function shuffleDeck(){
	deck = $('.deck').empty(); // emptied contents of deck.
	
	deck_elements = shuffle(deck_elements); // Shuffled the deck.

	for (i=0; i< deck_elements.length; i++){
		$('.deck').append('<li class="card"><i class="fa fa-'+deck_elements[i]+'"></i></li>');
	}	// add cards with HTML into deck class

}

function enableCardClick(){
	$('.card').on('click', function(event){
		clicky(event);
	});
}

 

function showCard(card){
	card.className = "card open show";
	opened_cards.push(card);
}


/*
 * every time two cards are checked, calls moveCounter.
 * If two cards match, their className changes into "card match"
 * one card icon is inserted into matched_cards array.
 * Then removed from opened cards array.
 * And then checkVictory is called.
 * If not matched, cards class name reverts to original
 * and they are removed from opened_cards array.
 *
 * finally, clicking othercards are enabled.
 */ 
function checkCards(){
		
		var card1 = opened_cards[opened_cards.length - 1];
		var card2 = opened_cards[opened_cards.length - 2];
		
		moveCounter();
		
		if (card1.childNodes[0].className == card2.childNodes[0].className){
			card1.className = "card match";
			card2.className = "card match";
			
			matched_cards.push(card1.childNodes[0].className);
			
			opened_cards.pop();
			opened_cards.pop();
			
			checkVictory();
		}else {
			card1.className = "card";
			card2.className = "card";
			
			opened_cards.pop();
			opened_cards.pop();
		}
	enableCardClick();
}

/*
 * Increases move per 2 cards opened.
 * And calls scoreStars to update stars in scoreboard
 */

function moveCounter(){
	moves++;
	$('.moves').text(moves);
	
	scoreStars();
}

/*
 * Depending on moves, changes the star score.
 */

function scoreStars(){

	if ( moves == 8 ){
		stars = 4;
	}else if ( moves > 8 && moves <= 12){
		stars = 3;
	}else if ( moves >=12 && moves <=17){
		$('.stars li:last-child .fa').removeClass("fa-star");
		$('.stars li:last-child .fa').addClass("fa-star-o");
		stars = 2;
	}else if ( moves >=18 && moves <= 23){
		$('.stars li:nth-child(2) .fa').removeClass("fa-star");
		$('.stars li:nth-child(2) .fa').addClass("fa-star-o");
		stars = 1;
	}
}

/* https://www.w3schools.com/howto/howto_css_modals.asp
 * helped me to create modal to show the victory screen as an overlay
 */

function popupVictory() {
   var popup = document.getElementById('victory-container');
   popup.style.display = "block";
			window.onclick = function(event) {
			if (event.target == popup) {
			popup.style.display = "none";
			}
		} 

}

/*
 * function of group of functions whenever a card is clicked.
 * It checks wheter the clicked target is a class of card,
 * then calls showCard function for that target.
 * If there is one card open while clicking another,
 * It delays checkCard function and disables clicking on other cards
 * Also when clicked, it initiates timer.
 */
 
function clicky(event){
	if (event.target.className == "card"){
			icon = event.target.childNodes[0];
			card = event.target
			
			showCard(card);
			
			if (opened_cards.length > 1){
			$('.card').off('click');
			setTimeout(checkCards, 650);
			}
			timer();

		}
}
 
/* https://stackoverflow.com/questions/17650776/add-remove-html-inside-div-using-javascript
 * link helped me a lot to add messages/stars to victory screen
 *
 * if matched_cards array length is equal to card_list length, then function starts.
 * Depending on stars player obtained, the information is passed to victory-screen
 *
 * then, appropriate custom message is passed to victory-screen.
 * timeUpdate is set to false to prevent updating time (aka timer is stopped)
 *
 * after that, victory modal is called.
 *
 */
  
 function checkVictory(){
	 if (matched_cards.length == card_list.length){
		 {
			 for(i=0;i < stars; i++){
				 starScore = document.createElement('i');
				 starScore.className = "fa fa-star";
				 document.getElementById('star-score').appendChild(starScore);
			 }
		 }
		 para = document.getElementById("custom-message");
		 switch(stars){
			 case 1:
				text1 = document.createTextNode("You can do better! Keep going!");
				para.appendChild(text1);
				break;
			 case 2:
				text2 = document.createTextNode("Good, good! Almost full stars!");
				para.appendChild(text2);
				break;
			 case 3:
				text3 = document.createTextNode("Perfect! Good Job!");
				para.appendChild(text3);
				 break;
			 case 4:
				text4 = document.createTextNode("Either you are cheating or you are a very very very very lucky person!");
				para.appendChild(text4);
				 break;
		 }
		 timeUpdate = false;
		 popupVictory();
	 }
 }
 
/*
 * resets values of variables and changed elements into their initial values.
 * calls shuffleDeck to create a different deck.
 * calls enableCardClick to initiate clicking function.
 */

 
 function restart(){
	
	opened_cards = [];
	matched_cards = [];
	
	timeExecute = false;
	timeRestart = true;
	timeUpdate = true;
	
	moves = 0;
	$('.moves').text(moves);
	
	stars = 3;
	$('.stars i').removeClass("fa-star-o");
	$('.stars i').addClass("fa-star");
	
	document.getElementById('star-score').innerHTML= "";
	
	shuffleDeck();
	
	enableCardClick();
		
	
	var popup = document.getElementById('victory-container');
    popup.style.display = "none";
}

/*
 * Starting point of inital function calls and
 * some events or stuff that are triggered.
 */

deck_elements = card_list.concat(card_list); // Created the deck
shuffleDeck();

enableCardClick();

$('.restart').on('click', function (event) {
    event.preventDefault();
    restart();
});
