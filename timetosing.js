/**
 *  Time to Sing!
 *
 *  A simple interactive web application.
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
    var imageLeft = imagePath + "left.png";
    var imageRight = imagePath + "right.png";
    var imageRight2 = imagePath + "right2.png";

    // HTML element references
    var imageLeftDiv = document.getElementById("imageLeft");
    var imageRightDiv = document.getElementById("imageRight");
    var timerDiv = document.getElementById("timer");

    // Set background images
    imageLeftDiv.style.backgroundImage = toUrlProperty(imageLeft);
    imageRightDiv.style.backgroundImage = toUrlProperty(imageRight);

    // Timer functionality and display
    var timer, timerDisplay;
    var timerOn = false;
    var timeLimitMs = 3000;
    var timerDisplayInterval = 10;

    // Set up CreateJS Sound object
    createjs.Sound.alternateExtensions = ["ogg"];
    createjs.Sound.addEventListener("fileload", createjs.proxy(handleLoadedSound, this));
    createjs.Sound.registerSound(audioSrc_left, audioId_left);
    createjs.Sound.registerSound(audioSrc_right1, audioId_right1);
    createjs.Sound.registerSound(audioSrc_right2, audioId_right2);

    // Click actions for images
    imageLeftDiv.onclick = function() {
        if (timerOn) {
            stopSound();
        }
        else {
            playSound(audioId_left);
            imageRightDiv.style.backgroundImage = toUrlProperty(imageRight2);
        }
        setTimer(timeLimitMs);
    }

    imageRightDiv.onclick = function() {
        var dice = Math.random();
        if (dice > 0.5) {
            playSound(audioId_right1);
        }
        else {
            playSound(audioId_right2);
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
            imageRightDiv.style.backgroundImage = toUrlProperty(imageRight);
            timerDiv.style.visibility = "hidden";
            timerDiv.textContent = "3.00";
            stopSound();
            timerOn = false;
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
        timerDiv.textContent = "3.00";
        timerOn = true;
        console.log("new timer instance");
    }

    // Helper function to more easily set CSS background-image URLs
    function toUrlProperty(path) {
        return "url('" + path + "')";
    }

} //end window.onload