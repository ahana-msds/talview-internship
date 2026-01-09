/**
 * TYPESCRIPT WITH DOM
 * scenario: candidate check-in system
 */

// get elements from DOM
const nameInput = document.getElementById("nameInput") as HTMLInputElement;
const checkInBtn = document.getElementById("checkInBtn") as HTMLButtonElement;
const resultText = document.getElementById("resultText") as HTMLParagraphElement;

// add click event
checkInBtn.addEventListener("click", () => {
    const name = nameInput.value;

    if (name.trim() === "") {
        resultText.textContent = "please enter your name!";
    } else {
        resultText.textContent = `welcome, ${name}. you are checked in.`;
    }
});
