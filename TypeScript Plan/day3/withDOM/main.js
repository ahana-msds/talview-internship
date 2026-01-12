/**
 * TYPESCRIPT WITH DOM
 * scenario: candidate check-in system
 */
// get elements from DOM
var nameInput = document.getElementById("nameInput");
var checkInBtn = document.getElementById("checkInBtn");
var resultText = document.getElementById("resultText");
// add click event
checkInBtn.addEventListener("click", function () {
    var name = nameInput.value;
    if (name.trim() === "") {
        resultText.textContent = "please enter your name!";
    }
    else {
        resultText.textContent = "welcome, ".concat(name, ". you are checked in.");
    }
});
