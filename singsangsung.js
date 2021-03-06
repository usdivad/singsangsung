/**
 *  Sing Sang Sung!
 *
 *  Game controls and rules:
 *      - Click/touch to play.
 *      - Left image instantiates timer and toggles sound as per specifications.
 *      - Right image increments score while timer is active.
 *      - Restarting timer while timer is active decrements current score by penalty amount,
 *        which increases by 1 each time timer is restarted.
 *
 *  ~ David Su dds2135@columbia.edu
 **/

window.onload = function() {

    // Audio asset references
    var audioPath = "./assets/audio/";
    var audioSrc_timer = audioPath + "background_short.mp3";
    var audioId_timer = "timerAudio";

    var bessieSounds = [
        {
            src: audioPath + "eh1.mp3",
            id: "bessie1"
        },
        {
            src: audioPath + "eh2.mp3",
            id: "bessie2"
        },
        {
            src: audioPath + "huh.mp3",
            id: "bessie3"
        },
        {
            src: audioPath + "ooh.mp3",
            id: "bessie4"
        }
    ];

    // Image assets
    var imagePath = "./assets/images/";
    var imageTimer = imagePath + "timer.png";
    var imageBessieGrayClosed = imagePath + "bessieGrayClosed.png";
    var imageBessieBlueClosed = imagePath + "bessieBlueClosed.png";
    var imageBessieGrayOpen = imagePath + "bessieGrayOpen.png";
    var imageBessieBlueOpen = imagePath + "bessieBlueOpen.png";

    // HTML element references
    var imageTimerDiv = document.getElementById("imageTimer");
    var imageBessieDiv = document.getElementById("imageBessie");
    var timerDisplayDiv = document.getElementById("timerDisplay");
    var highScoreDiv = document.getElementById("highScore");
    var currScoreDiv = document.getElementById("currScore");

    // Set background images
    imageTimerDiv.style.backgroundImage = toUrlProperty(imageTimer);
    imageBessieDiv.style.backgroundImage = toUrlProperty(imageBessieGrayClosed);

    // Timer functionality and display
    var timer, timerDisplay;
    var timerOn = false;
    var timeLimitMs = 3000;
    var timerDisplayInterval = 10;    
    
    // Timer canvas element
    var timerCanvas = document.getElementById("timerCanvas");
    timerCanvas.width = 125;
    timerCanvas.height = timerCanvas.width;
    // // console.log("width: " + timerCanvas.width);
    
    var ctx = timerCanvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.clearRect(0, 0, timerCanvas.width, timerCanvas.height);
    ctx.save();

    // Scoreboard for game
    var highScore = 0;
    var currScore = 0;
    var penalty = 0;

    // Set up CreateJS Sound object and registrations
    createjs.Sound.alternateExtensions = ["ogg"];
    createjs.Sound.addEventListener("fileload", createjs.proxy(handleLoadedSound, this));
    createjs.Sound.registerSound(audioSrc_timer, audioId_timer);
    for (var i=0; i<bessieSounds.length; i++) {
        var bessieSound = bessieSounds[i];
        createjs.Sound.registerSound(bessieSound.src, bessieSound.id);
    }

    // Click actions for images
    if ("ontouchstart" in imageTimerDiv) { // touch event
        imageTimerDiv.addEventListener("touchstart", function() {
            timerAction();
        });
        imageBessieDiv.addEventListener("touchstart", function() {
            bessieDownAction();
        });
        imageBessieDiv.addEventListener("touchend", function() {
            bessieUpAction();
        });
    }
    else { // mouse event
        imageTimerDiv.addEventListener("mousedown", function() {
            timerAction();
        });
        imageBessieDiv.addEventListener("mousedown", function() {
            bessieDownAction();
        });
        imageBessieDiv.addEventListener("mouseup", function() {
            bessieUpAction();
        });
    }


    /** Functions **/

    // Timer image actions
    function timerAction() {
        // Sound
        if (timerOn) {
            stopSound();
        }
        else {
            playSound(audioId_timer);
            imageBessieDiv.style.backgroundImage = toUrlProperty(imageBessieBlueClosed);
        }
        // Timer
        setTimer(timeLimitMs);

        // Clear timer canvas
        ctx.clearRect(0, 0, timerCanvas.width, timerCanvas.height);
        // console.log("clear canvas");

    }

    // Bessie image actions
    function bessieDownAction() {
        //Image, score
        if (timerOn) {
            imageBessieDiv.style.backgroundImage = toUrlProperty(imageBessieBlueOpen);
            currScore += 1;
            updateScoreboard();
        }
        else {
            imageBessieDiv.style.backgroundImage = toUrlProperty(imageBessieGrayOpen);
        }

        // Sound
        var index = Math.floor(Math.random() * bessieSounds.length);
        var bessieSound = bessieSounds[index];
        playSound(bessieSound.id);
    }

    function bessieUpAction() {
        //Image
        if (timerOn) {
            imageBessieDiv.style.backgroundImage = toUrlProperty(imageBessieBlueClosed);
        }
        else {
            imageBessieDiv.style.backgroundImage = toUrlProperty(imageBessieGrayClosed);
        }
    }

    // Sound handlers
    function handleLoadedSound(event) {
        console.log(event.id + " loaded");
    }

    function playSound(id) {
        var instance = createjs.Sound.play(id);
        if (instance == null || instance.playState == createjs.Sound.PLAY_FAILED) {
            console.log("playSound failed");
            return;
        }
        console.log("playing " + id);
    }

    function stopSound() {
        createjs.Sound.stop();
        // console.log("stop sound");
    }

    // Re-instantiates timer
    function setTimer(value) {
        // Timer (timeout)
        if (typeof(timer) != undefined) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            // Timer
            imageBessieDiv.style.backgroundImage = toUrlProperty(imageBessieGrayClosed);
            timerDisplayDiv.style.visibility = "hidden";
            timerDisplayDiv.textContent = (timeLimitMs/1000).toFixed(2);
            clearInterval(timerDisplay);
            timerOn = false;
            timerCanvas.style.visibility = "hidden";
            // requestAnimationFrame(moveClockHand);

            // Sound
            stopSound();

            // Score and penalty
            currScore = 0;
            penalty = 0;
            updateScoreboard();
            currScoreDiv.style.visibility = "hidden";
        }, value);

        // Timer display (interval)
        if (typeof(timerDisplay) != undefined) {
            clearInterval(timerDisplay);
        }
        timerDisplay = setInterval(function() {
            var timeLeft = parseFloat(timerDisplayDiv.textContent);
            var timeLeftMs = timeLeft * 1000;
            timeLeft -= timerDisplayInterval / 1000;
            timerDisplayDiv.textContent = timeLeft.toFixed(2);
            moveClockHand(timeLeftMs, timeLimitMs);
        }, timerDisplayInterval);

        // Reset timer vars
        timerDisplayDiv.style.visibility = "visible";
        timerCanvas.style.visibility = "visible";
        timerDisplayDiv.textContent = (timeLimitMs/1000).toFixed(2);
        timerOn = true;
        // console.log("new timer instance");

        // Update score and penalty
        currScoreDiv.style.visibility = "visible";
        if (currScore >= penalty) {
            currScore -= penalty;
        }
        else {
            currScore = 0;
        }
        penalty++;
        updateScoreboard();
    }

    // Move the clock hand based on time left and overall time limit
    function moveClockHand(timeLeft, timeLimit) {
        // var timeLeft = parseFloat(timerDisplayDiv.textContent) * 1000;
        // var timeLimit = timeLimitMs;
        timeLeft = timeLeft - 270; // latency
        var angle = (timeLeft/timeLimit) * Math.PI * 2;
        // console.log(timeLeft + "ms: " + timeLeft*100/timeLimit + "%: " + angle*180/Math.PI + "°");
        ctx.save();
        ctx.translate(timerCanvas.width/2,timerCanvas.height/2);
        ctx.rotate(-Math.PI/2);
        ctx.rotate(angle);
        ctx.clearRect(0, 0, timerCanvas.width, timerCanvas.height);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(60, 0);
        ctx.stroke();
        ctx.restore();

        // requestAnimationFrame(moveClockHand);
    }

    // Update the scoreboard with current and high scores
    function updateScoreboard() {
        if (currScore > highScore) {
            highScore = currScore;
        }
        currScoreDiv.textContent = "Current Score: " + currScore;
        highScoreDiv.textContent = "High Score: " + highScore;
        // console.log("penalty: " + penalty);
    }

    // Helper function to more easily set CSS background-image URLs
    function toUrlProperty(path) {
        return "url('" + path + "')";
    }

} //end window.onload