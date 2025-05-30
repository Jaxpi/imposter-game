const startButton = document.getElementById("start-button");
const countdownDiv = document.getElementById("countdown");
const promptDiv = document.getElementById("prompt");
const sound = document.getElementById("sound");
let usedPrompts = [];
let currentPrompts = [];

// Create "Guess the Imposter!" text element
const imposterDiv = document.createElement("div");
imposterDiv.id = "imposter";
imposterDiv.innerHTML = "Guess the Imposter!";
document.body.appendChild(imposterDiv);

// **Set initial button text to "Start"**
startButton.innerHTML = "Start";
startButton.style.display = "block";

// **Function to Start a Round**
function startRound() {
    startButton.style.display = "none";
    imposterDiv.style.display = "none"; // Hide "Guess the Imposter!" when restarting

    // **Ensure prompts don’t repeat until all are used**
    if (usedPrompts.length === prompts.length) {
        usedPrompts = []; // Reset used prompts after all are shown
    }

    // Select a unique prompt pair
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * prompts.length);
    } while (usedPrompts.includes(randomIndex));

    usedPrompts.push(randomIndex);
    currentPrompts = prompts[randomIndex];

    function playSound() {
        sound.play();
    }

    function countdown(seconds, callback) {
        countdownDiv.innerHTML = seconds;
        if (seconds > 0) {
            setTimeout(() => countdown(seconds - 1, callback), 1000);
        } else {
            countdownDiv.innerHTML = "";
            callback();
        }
    }

    function showPrompt(text, duration, nextStep) {
        promptDiv.innerHTML = text;
        promptDiv.style.display = "block";
        setTimeout(() => {
            promptDiv.style.display = "none";
            playSound();
            setTimeout(() => nextStep(), 1000);
        }, duration);
    }

    countdown(3, () => showPrompt(currentPrompts[0], 7000, () => { // **Now shows for 7 seconds**
        countdown(5, () => showPrompt(currentPrompts[1], 7000, () => { // **Pause now 5 seconds**
            imposterDiv.style.display = "block";

            // **Change button text to "Reveal Prompts"**
            setTimeout(() => {
                startButton.style.display = "block";
                startButton.innerHTML = "Reveal Prompts";
                imposterDiv.insertAdjacentElement("afterend", startButton);
            }, 1000);
        }));
    }));
}

// **Event Listener for Button Clicks**
startButton.addEventListener("click", () => {
    if (startButton.innerHTML === "Start" || startButton.innerHTML === "Reveal Prompt") {
        startButton.innerHTML = "Reveal Prompt"; // Reset after first click
        startRound(); // **Start the first round**
    } else if (startButton.innerHTML === "Reveal Prompts") {
        // **Hide "Guess the Imposter!" and display both prompts**
        imposterDiv.style.display = "none"; 
        promptDiv.innerHTML = `<strong>${currentPrompts[0]}</strong><br>---<br><strong>${currentPrompts[1]}</strong><br>---<br>`;
        promptDiv.style.display = "block";
        promptDiv.style.color = "white";

        // **Change button text to "Next Prompt"**
        setTimeout(() => {
            startButton.innerHTML = "Next Prompt";
        }, 1000);
    } else if (startButton.innerHTML === "Next Prompt") {
        startButton.innerHTML = "Reveal Prompt"; // Reset for next round
        promptDiv.innerHTML = "";
        imposterDiv.style.display = "none";
        startRound();
    }
});