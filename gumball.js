/**
 *  Gumball Machine
 *
 *  Returns either a red, green or blue gumball with given probabilities.
 *
 *  ~ David Su dds2135@columbia.edu
 **/

// For JSFiddle
// (function() {

// For web
window.onload = function() {
    // HTML elements
    var gumballDiv = document.getElementById("gumball");
    var gumballGetterDiv = document.getElementById("gumballGetter");

    // Array of colors with corresponding probability distribution
    var red = "R";     // 0.2
    var green = "G";   // 0.3
    var blue = "B";    // 0.5
    var colors = [red, red, green, green, green, blue, blue, blue, blue, blue];

    // Gumball color setting
    gumballGetterDiv.onclick = setGumballColor;
    setGumballColor();

    // Single function that sets gumball color based on probabilities
    function setGumballColor() {
        // Pick random color from colors array
        var index = Math.floor(Math.random() * colors.length);
        var color = colors[index];
        
        // Set gumball div color based on chosen color
        switch(color) {
            case red:
                gumballDiv.style.backgroundColor = "red";
                break;
            case green:
                gumballDiv.style.backgroundColor = "green";
                break;
            case blue:
                gumballDiv.style.backgroundColor = "blue";
                break;
        }

        console.log(color);
    }
};

// })();