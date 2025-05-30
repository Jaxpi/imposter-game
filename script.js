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
  promptDiv.classList.remove("white-text"); // Reset color formatting

  if (usedPrompts.length === prompts.length) {
    usedPrompts = []; // Reset used prompts after all are shown
  }

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
    playSound(); // **Sound plays before showing prompt**
    promptDiv.innerHTML = text;
    promptDiv.style.display = "block";
    setTimeout(() => {
      promptDiv.style.display = "none"; // **Hide prompt after duration**
      setTimeout(() => nextStep(), 1000);
    }, duration);
  }

  countdown(3, () => {
    playSound(); // **Sound before Group Prompt**
    showPrompt(
      `<span class="cyan-text">Group Prompt:</span> <span class="white-text">${currentPrompts[0]}</span>`,
      7000,
      () => {
        // **Show group prompt in correct colors**

        setTimeout(() => {
          // **Hide group prompt before next step**
          promptDiv.style.display = "none";
          playSound(); // **Sound before countdown**

          countdown(5, () => {
            playSound(); // **Sound before Imposter Prompt**
            showPrompt(
              `<span class="red-text">Imposter Prompt:</span> <span class="white-text">${currentPrompts[1]}</span>`,
              7000,
              () => {
                // **Show imposter prompt in correct colors**

                setTimeout(() => {
                  // **Hide imposter prompt before next step**
                  promptDiv.style.display = "none";
                  playSound(); // **Sound before "Guess the Imposter!"**

                  // **Show "Guess the Imposter!" at the top**
                  imposterDiv.style.display = "block";
                  promptDiv.innerHTML = `<strong class="cyan-text">Group Prompt:</strong> <span class="white-text">${currentPrompts[0]}</span>`;
                  promptDiv.style.display = "block";

                  // **Ensure button appears BELOW everything**
                  startButton.style.display = "block";
                  startButton.innerHTML = "Reveal Imposter Prompt";
                  imposterDiv.insertAdjacentElement("afterend", promptDiv); // Group prompt BELOW "Guess the Imposter!"
                  promptDiv.insertAdjacentElement("afterend", startButton); // Button BELOW Group Prompt
                });
              }
            );
          });
        });
      }
    );
  });
}

// **Event Listener for Button Clicks**
startButton.addEventListener("click", () => {
  if (
    startButton.innerHTML === "Start" ||
    startButton.innerHTML === "Reveal Prompt"
  ) {
    startButton.innerHTML = "Reveal Prompt";
    startRound();
  } else if (startButton.innerHTML === "Reveal Imposter Prompt") {
    // **Hide "Guess the Imposter!"**
    imposterDiv.style.display = "none";

    // **Append the Imposter Prompt with correct colors**
    promptDiv.innerHTML += `<br>---<br><strong class="red-text">Imposter Prompt:</strong> <span class="white-text">${currentPrompts[1]}</span>`;

    // **Change button to "Next Round"**
    startButton.innerHTML = "Next Round";
  } else if (startButton.innerHTML === "Next Round") {
    // **Reset for next round**
    startButton.innerHTML = "Reveal Prompt";
    promptDiv.innerHTML = "";
    imposterDiv.style.display = "none";
    startRound();
  }
});
