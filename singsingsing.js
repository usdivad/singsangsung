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
    var audioSrc_left = audioPath + "background_short.mp3";
    var audioId_left = "left";
    var audioSrc_right1 = audioPath + "eh1.mp3";
    var audioId_right1 = "right1";
    var audioSrc_right2 = audioPath + "eh2.mp3";
    var audioId_right2 = "right2";
    var imageLeft = imagePath + "timer.png";
    var imageRight = imagePath + "bessieGrayClosed.png";
    var imageRight2 = imagePath + "bessieBlueOpen.png";

    // HTML element references
    var imageLeftDiv = document.getElementById("imageLeft");
    var imageRightDiv = document.getElementById("imageRight");
    var timerDiv = document.getElementById("timer");
    var highScoreDiv = document.getElementById("highScore");
    var currScoreDiv = document.getElementById("currScore");

    // Set background images
    imageLeftDiv.style.backgroundImage = toUrlProperty(imageLeft);
    imageRightDiv.style.backgroundImage = toUrlProperty(imageRight);

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
    createjs.Sound.registerSound(audioSrc_left, audioId_left);
    createjs.Sound.registerSound(audioSrc_right1, audioId_right1);
    createjs.Sound.registerSound(audioSrc_right2, audioId_right2);

    // Click actions for images
    imageLeftDiv.onclick = function() {
        // Sound
        if (timerOn) {
            stopSound();
        }
        else {
            playSound(audioId_left);
            imageRightDiv.style.backgroundImage = toUrlProperty(imageRight2);
        }
        // Timer
        setTimer(timeLimitMs);
    }

    imageRightDiv.onclick = function() {
        // Sound
        var dice = Math.random();
        if (dice > 0.5) {
            playSound(audioId_right1);
        }
        else {
            playSound(audioId_right2);
        }

        // Score
        if (timerOn) {
            currScore += 1;
            updateScoreboard();
        }
    }

    // Sound handlers
    function handleLoadedSound(event) {
        console.log(audioId_left + " loaded");
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
            imageRightDiv.style.backgroundImage = toUrlProperty(imageRight);
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