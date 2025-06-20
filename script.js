const startButton = document.getElementById("start-button");
const countdownDiv = document.getElementById("countdown");
const promptDiv = document.getElementById("prompt");
const sounds = [
  new Audio("audio/circleLookSound.mp3"),
  new Audio("audio/closeYourEyesSound.mp3"),
  new Audio("audio/xLookSound.mp3"),
  new Audio("audio/everyoneLookSound.mp3"),
];
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

  function playSound(index) {
    if (index >= 0 && index < sounds.length) {
      sounds[index].play();
    }
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
    playSound(); // **Sound before showing prompt**
    promptDiv.innerHTML = text;
    promptDiv.style.display = "block";
    setTimeout(() => {
      promptDiv.style.display = "none"; // **Hide prompt after duration**
      setTimeout(() => nextStep(), 1000);
    }, duration);
  }

  countdown(3, () => {
    playSound(0); // Sound before Group Prompt
    showPrompt(
      `<span class="cyan-text">Group Prompt:</span> <span class="white-text">${currentPrompts[0]}</span>`,
      7000,
      () => {
        setTimeout(() => {
          promptDiv.style.display = "none";
          playSound(1); // Sound before countdown

          countdown(5, () => {
            playSound(2); // Sound before Imposter Prompt
            showPrompt(
              `<span class="red-text">Imposter Prompt:</span> <span class="white-text">${currentPrompts[1]}</span>`,
              7000,
              () => {
                setTimeout(() => {
                  promptDiv.style.display = "none";
                  playSound(3); // Sound before "When everyone is ready..."
                  setTimeout(() => {
                    promptDiv.innerHTML = `<strong class="white-text">When everyone is ready, reveal your responses.</strong>`;
                    promptDiv.style.display = "block";

                    // Ensure the button is visible again
                    startButton.style.display = "block";
                    startButton.innerHTML = "Show Prompt";
                    promptDiv.insertAdjacentElement("afterend", startButton);
                  }, 1000); // Adding a slight delay to ensure the update happens
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
  } else if (startButton.innerHTML === "Show Prompt") {
    // **Ensure "Guess the Imposter!" appears first**
    imposterDiv.style.display = "block";

    // **Insert "Guess the Imposter!" BEFORE anything else**
    document.body.insertBefore(imposterDiv, document.body.firstChild); // Moves it to the top

    // **Now insert the Group Prompt BELOW "Guess the Imposter!"**
    promptDiv.innerHTML = `<strong class="cyan-text">Group Prompt:</strong> <span class="white-text">${currentPrompts[0]}</span>`;
    promptDiv.style.display = "block";

    // **Ensure "Reveal Imposter Prompt" button is at the bottom**
    startButton.innerHTML = "Reveal Imposter Prompt";

    // **Insert elements in correct order**
    promptDiv.insertAdjacentElement("beforebegin", imposterDiv); // Places Group Prompt below "Guess the Imposter!"
    startButton.insertAdjacentElement("beforebegin", promptDiv); // Places Button below Group Prompt
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
