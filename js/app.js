////////////
////13.12.2017
//  The date skynet took over the humanity,
//  our only salvation lies in this memory game.
///////////
// Jk, I've decided to tidy up the code, put everything into
// meaningful functions.

// Put a modal for restart button, saying are you sure buddy kind of stuff
// Yeah, also while doing that remember to put a cancel button.
// Also put a play again button to popupVictory.. No need for cancel button, since we can go out by
// clicking out of the box? hmmmmmmm

 
/*
 * Variables
 */
 
var card_list = ["diamond","paper-plane-o","anchor","bolt","cube","leaf","bicycle","bomb"];

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

// Time function FINALLY! https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
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
	deck = $('.deck').empty();
	
	deck_elements = shuffle(deck_elements); // Shuffled the deck

	for (i=0; i< deck_elements.length; i++){
		$('.deck').append('<li class="card"><i class="fa fa-'+deck_elements[i]+'"></i></li>');
	}	// add cards with HTML into deck class

}
	 
/*
 * YOU KNOW YOU SHOULD SHOW THE WRONG CARD FOR 1SEC OR SOMETHING AND THEN CLOSE IT
 * THAT IS HOW THE GAME IS PLAYED, IT IS NOT A RUSSIAN ROULETTE!
 */
function showCard(card){
	card.className = "card open show";
	opened_cards.push(card);
}


 
function checkCards(card){
	if (opened_cards.length > 1){
		
		card1 = opened_cards[opened_cards.length - 1];
		card2 = opened_cards[opened_cards.length - 2];
		
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
		
	}
}

function moveCounter(){
	moves++;
	$('.moves').text(moves);
	
	scoreStars();
}

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
	}else if (moves >=23 && moves <= 28){
		$('.stars li .fa').removeClass("fa-star");
		$('.stars li .fa').addClass("fa-star-o");
		stars = 0;
	}else if (moves >=29){
		stars = -1;
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
 
function clicky(event){
	if (event.target.className == "card"){
			icon = event.target.childNodes[0];
			card = event.target
			
			showCard(card);
			
			checkCards(card);
			
			timer();

		}
}
 
 /* https://stackoverflow.com/questions/17650776/add-remove-html-inside-div-using-javascript
 *  link helped me a lot to add messages/stars to victory screen
 */
  
 function checkVictory(){
	 if (matched_cards.length == card_list.length){
		 i = 0;
		 for(i=0;i < stars; i++){
			 starScore = document.createElement('i');
			 starScore.className = "fa fa-star";
			 document.getElementById('star-score').appendChild(starScore);
		 }
		 
		 para = document.getElementById("custom-message");
		 switch(stars){
			 case 0:
				text0 = document.createTextNode("Try harder next time!");
				para.appendChild(text0);
				break;
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
				text4 = document.createTextNode("Either you are cheating or you are very very very very lucky person!");
				para.appendChild(text4);
				 break;
			 case -1:
				textMinus = document.createTextNode("Dude.... Really?");
				para.appendChild(textMinus);
				break;
		 }
		 timeUpdate = false;
		 popupVictory();
	 }
 }
 

 
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
	
	shuffleDeck();
	
	$('.card').on('click', function(event){
		clicky(event);
	});
		
	
	var popup = document.getElementById('victory-container');
    popup.style.display = "none";
}

/*
 * Starting point of inital function calls and
 * some events or stuff that are triggered.
 */

deck_elements = card_list.concat(card_list); // Created the deck
shuffleDeck()

$('.card').on('click', function(event){
		clicky(event);
});

$('.restart').on('click', function (event) {
    event.preventDefault();
    restart();
});
