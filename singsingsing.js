/**
 *  Sing Sing Sing!
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

    // Assets references
    var audioPath = "./assets/audio/";
    var imagePath = "./assets/images/";
    var audioSrc_timer = audioPath + "background_short.mp3";
    var audioId_timer = "left";
    var audioSrc_bessie1 = audioPath + "eh1.mp3";
    var audioId_bessie1 = "right1";
    var audioSrc_bessie2 = audioPath + "eh2.mp3";
    var audioId_bessie2 = "right2";
    var imageTimer = imagePath + "timer.png";
    var imageBessieGrayClosed = imagePath + "bessieGrayClosed.png";
    var imageBessieBlueClosed = imagePath + "bessieBlueClosed.png";
    
    var imageBessieGrayOpen = imagePath + "bessieGrayOpen.png";
    var imageBessieBlueOpen = imagePath + "bessieBlueOpen.png";

    // HTML element references
    var imageTimerDiv = document.getElementById("imageTimer");
    var imageBessieDiv = document.getElementById("imageBessie");
    var timerDiv = document.getElementById("timer");
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

    // Scoreboard for game
    var highScore = 0;
    var currScore = 0;
    var penalty = 0;

    // Set up CreateJS Sound object
    createjs.Sound.alternateExtensions = ["ogg"];
    createjs.Sound.addEventListener("fileload", createjs.proxy(handleLoadedSound, this));
    createjs.Sound.registerSound(audioSrc_timer, audioId_timer);
    createjs.Sound.registerSound(audioSrc_bessie1, audioId_bessie1);
    createjs.Sound.registerSound(audioSrc_bessie2, audioId_bessie2);

    // Click actions for images
    imageTimerDiv.onclick = function() {
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
    };

    imageBessieDiv.onclick = function() {
        // Sound
        var dice = Math.random();
        if (dice > 0.5) {
            playSound(audioId_bessie1);
        }
        else {
            playSound(audioId_bessie2);
        }

        // Score
        if (timerOn) {
            currScore += 1;
            updateScoreboard();
        }
    };

    // Right image change when pressed
    imageBessieDiv.addEventListener("mousedown", function() {
        if (timerOn) {
            imageBessieDiv.style.backgroundImage = toUrlProperty(imageBessieBlueOpen);
        }
        else {
            imageBessieDiv.style.backgroundImage = toUrlProperty(imageBessieGrayOpen);
        }
    });

    imageBessieDiv.addEventListener("mouseup", function() {
        if (timerOn) {
            imageBessieDiv.style.backgroundImage = toUrlProperty(imageBessieBlueClosed);
        }
        else {
            imageBessieDiv.style.backgroundImage = toUrlProperty(imageBessieGrayClosed);
        }
    });

    // Sound handlers
    function handleLoadedSound(event) {
        console.log(audioId_timer + " loaded");
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
        console.log("stop sound");
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
            timerDiv.style.visibility = "hidden";
            timerDiv.textContent = (timeLimitMs/1000).toFixed(2);
            timerOn = false;

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
            var timeLeft = parseFloat(timerDiv.textContent);
            timeLeft -= timerDisplayInterval / 1000;
            timerDiv.textContent = timeLeft.toFixed(2);
        }, timerDisplayInterval);

        // Reset timer vars
        timerDiv.style.visibility = "visible";
        timerDiv.textContent = (timeLimitMs/1000).toFixed(2);
        timerOn = true;
        console.log("new timer instance");

        // Update score and penalty
        currScoreDiv.style.visibility = "visible"
        if (currScore >= penalty) {
            currScore -= penalty;
        }
        else {
            currScore = 0;
        }
        penalty++;
        updateScoreboard();
    }

    // Update the scoreboard with current and high scores
    function updateScoreboard() {
        if (currScore > highScore) {
            highScore = currScore;
        }
        currScoreDiv.textContent = "Current Score: " + currScore;
        highScoreDiv.textContent = "High Score: " + highScore;
        console.log("penalty: " + penalty);
    }

    // Helper function to more easily set CSS background-image URLs
    function toUrlProperty(path) {
        return "url('" + path + "')";
    }

} //end window.onload