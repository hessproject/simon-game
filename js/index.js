var SimonGame = (function() {
	//private variables
	var audio1 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'); //green
	var audio2 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'); //red
	var audio3 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'); //yellow
	var audio4 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'); //blue
	var gameInProgress = false;
	var playerTurn = false;
	var playingSequence = false;
	var speed = 1000;
	var sequence = [];
	var response = [];
	var unlimitedRounds;
	var strictMode;


	//private functions
	function lightButton(buttonNumber){
		switch(buttonNumber){
			case 1:
				$('.board-top-left').toggleClass('isLit');
				audio1.play();
				setTimeout(function(){
					$('.board-top-left').toggleClass('isLit');
				},300);
				break;
			case 2:
				$('.board-top-right').toggleClass('isLit');
				audio2.play();
				setTimeout(function(){
					$('.board-top-right').toggleClass('isLit');
				},300);
				break;
			case 3:
				$('.board-bot-left').toggleClass('isLit');
				audio3.play();
				setTimeout(function(){
					$('.board-bot-left').toggleClass('isLit');
				},300);
				break;
			case 4:
				$('.board-bot-right').toggleClass('isLit');
				audio4.play();
				setTimeout(function(){
					$('.board-bot-right').toggleClass('isLit');
				},300);
				break;
			default:
				break;
		}
	}
	
	//Add a random button to the simon sequence
	function addToSequence() {
		sequence.push(Math.floor(Math.random() * 4) + 1);
	}

	//Play through and light all the buttons of the current simon sequence
	function playSequence(gameSpeed) {
		playingSequence = true;
		$('#gameStatus').html("Playing Sequence");
		var i = 0;
		var sequenceInterval = setInterval(playNext,gameSpeed);
		response = [];
		function playNext(){
			if(i >= sequence.length){
				$("#gameStatus").html("Waiting For Player Response");
				clearInterval(sequenceInterval);
				playingSequence = false;
			} else {
				lightButton(sequence[i]);
				i++;
			}
		}
	}

	//Start the next round: Add to the sequence, play the sequence, and speed up on the 5th, 9th, and 13th round.
	function nextRound() {
		addToSequence();
		var roundNumber = simon.getRound();
		if(roundNumber < 5){
			speed = 1000;
		} else if (roundNumber < 9){
			speed = 800;
		} else if (roundNumber < 13){
			speed = 600;
		} else {
			speed = 400;
		}
		$("#roundNumber").html("Number of Steps: " + roundNumber);
		setTimeout(function(){
			playSequence(speed);
		},1000);
	}
	
	//Check user response against the current sequence
	function checkResponse() {
		for (var i = 0; i < response.length; i++) {
			if (response[i] != sequence[i]) {
				return false;
			}
		}
		return true;
	}

	//public functions
	function SimonGame() {

		this.getRound = function() {
			return sequence.length;
		};

		this.startGame = function() {
			$('#gameStatus').html('Starting Game');
			playingSequence = false;
			gameInProgress = true;
			speed = 1000;
			sequence = [];
			nextRound();
			strictMode = $("#strict-check").prop("checked");
			unlimitedRounds = $("#unlimited-check").prop("checked");
		};

		this.pressButton = function(buttonNumber) {
			lightButton(buttonNumber);
			response.push(buttonNumber);
			if(gameInProgress){
				
				//actions for incorrect response
				if(checkResponse()===false){
					
					//for strict mode, end game immediately 
					if(strictMode){
						$("#gameStatus").html("Incorrect Response: Game Over");
						gameInProgress = false;
					}
					
					//for non-strict mode, play the sequence and let the user try again
					if(!strictMode && playingSequence===false){
						$("#gameStatus").html("Incorrect Response: Try Again");
						playingSequence = true;
						setTimeout(function(){
							playSequence(speed);
						},2000);
					}
				}
				
				//correct response actions
				if(checkResponse()===true && this.getRound() < 20 &&gameInProgress && response.length === sequence.length){
					$('#gameStatus').html("Correct!");
					nextRound();
				}
				
				// victory conditions
				if(!unlimitedRounds){
					if(checkResponse()===true && this.getRound() >= 20 && response.length === sequence.length){
						$('#gameStatus').html("Congratulations, You've Won! Play again?");
					}
				}
			}
		}
		
	}
	
	return SimonGame;

})();

var simon = new SimonGame();
