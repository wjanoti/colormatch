$(document).ready(function () {

	function Game () {
		this.colors = [];
		this.score = 0;
		this.cardFlipped = false;
		this.flipCount = 0;
		this.preventClick = false;
		this.pairsMatched = 0;
		this.timer = null;
		that = this;
		$("button").on("click", function () {
			if (confirm("Restart the current game?")){
				that.start();
			}
		});
	};

	Game.prototype.shuffleCards = function () {
		//Fisher-Yates shuffling algorithm.
		var i = this.colors.length;
		if (i === 0) { return; }
		while (--i) {
		   var j = Math.floor(Math.random() * (i + 1));
		   var tmpI = this.colors[i];
		   var tmpJ = this.colors[j];
		   this.colors[i] = tmpJ;
		   this.colors[j] = tmpI;
		}
		//duplicate the color array, so we have the pairs.
        this.colors = $.merge(this.colors, this.colors);
	};

    Game.prototype.createBoard = function () {
        $("#board").children().remove();
        //create the card elements.
        for (var i = 0; i < this.colors.length; i++){
			 $('#board').append("<div class='card'><div class='flipper'><div class='front'></div><div class='back'></div></div></div></div>");
        }
    };

	Game.prototype.startTimer = function () {
		var startTime = new Date();
		$("#time").text("00:00:00");
		var that = this;
		this.timer = setInterval(function () {
		    var nowTime = new Date();
		    var timeDiff = nowTime - startTime;
		    timeDiff /= 1000;
		    var seconds = Math.round(timeDiff % 60);
		    timeDiff = Math.floor(timeDiff / 60);
		    var minutes = Math.round(timeDiff % 60);
		    timeDiff = Math.floor(timeDiff / 60);
		    var hours = Math.round(timeDiff % 24);
		    hours = (hours < 10) ? "0" + hours : hours;
		    minutes = (minutes < 10) ? "0" + minutes : minutes;
		    seconds = (seconds < 10) ? "0" + seconds : seconds;
			timeString = hours + ":" + minutes + ":" + seconds;
			that.updateStats(null, null, timeString);
		}, 1000);
	};

	Game.prototype.stopTimer = function () {
        if (this.timer){
            clearInterval(this.timer);
        }
	};

	Game.prototype.resetTimer = function () {
        this.stopTimer();
        $("#time").text("00:00:00");
    };

	Game.prototype.updateStats = function (score, flipCount, time) {
		if (score !== null) {
			$("#score").text(score);
		} 
		if (flipCount !== null) {
			$("#flips").text(flipCount);
		}
		if (time !== null) {
			$("#time").text(time);
		}
	};

	Game.prototype.start = function () {
		this.colors = ['red', 'blue', 'green', 'black', 'purple', 'yellow', 'cyan', 'white'];
        this.score = 0;
        this.flipCount = 0;
		this.shuffleCards();
		this.createBoard();
		this.updateStats(this.score, this.flipCount, null);
		this.resetTimer();
		//saving the context to use inside the click handler function.
		var that = this;
        $(".flipper").on("click", function () {
            if ($(this).hasClass("flip") || that.preventClick) { return; }
            if (that.flipCount === 0) {
                that.startTimer();
            }
            var i = $(this).closest(".card").index();
            $(this).find('div.back').css("background-color", that.colors[i]);
            $(this).toggleClass('flip');
            that.flipCount++;
            if (that.cardFlipped) {
                //do not allow click when there are two cards flipped.
                that.preventClick = true;
                //check if colors are equal.
                if ($(".flip .back:first").css('background-color') === $(".flip .back:last").css('background-color')) {
                   that.score++;
                   that.pairsMatched++;
                   setTimeout(function () {
                       $('.flipper.flip').css("display", "none");
                       $(".flipper.flip").removeClass("flip");
                       that.preventClick = false;
                       if (that.pairsMatched === 8) {
                           if (confirm('You won the game! Wanna try again?')) {
                               that.resetTimer();
                               that.start();
                           }
                       }
                    }, 2000);
                } else {
                    // didn't make a match.
                    setTimeout(function () {
						$('.flipper.flip').toggleClass('flip');
                        that.preventClick = false;
                    }, 2000);
                    // no negative scores.
                    if (that.score > 0) that.score--;
                }
                that.cardFlipped = false;
            } else {
                that.cardFlipped = true;
            }
           that.updateStats(that.score, that.flipCount, null);
        });
	};

	//start the game
	var game = new Game();
	game.start();

});
