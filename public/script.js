const inputTextarea = document.querySelector(".input-section textarea");
const generateButton = document.querySelector("#generateButton");
const outputTextarea = document.querySelector(".output-section textarea");

// Save the notes and proposal in this browser, so a refresh doesn't lose them
function saveDraft() {
  try {
    localStorage.setItem("draftNotes", inputTextarea.value);
    localStorage.setItem("draftProposal", outputTextarea.value);
  } catch (error) {
    // Storage can be blocked (e.g. some private browsing modes) - the app still works without it
  }
}

// Put back anything saved from last time
try {
  inputTextarea.value = localStorage.getItem("draftNotes") || "";
  outputTextarea.value = localStorage.getItem("draftProposal") || "";
} catch (error) {}

// Save whenever the user types, and when they leave or refresh the page
inputTextarea.addEventListener("input", saveDraft);
outputTextarea.addEventListener("input", saveDraft);
window.addEventListener("pagehide", saveDraft);

generateButton.addEventListener("click", async function () {
    const userNotes = inputTextarea.value;

    // 1. Show the user something is happening, and block extra clicks
    generateButton.disabled = true;
    generateButton.textContent = "Generating...";

    try {
        const response = await fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                notes: userNotes
            })
        });

        const data = await response.json();

        // 2. The server answered, but with an error (empty notes, too long, rate limit)
        if (!response.ok) {
            alert(data.message);
            return;
        }

        outputTextarea.value = data.message;
    } catch (error) {
        // 3. The server couldn't be reached at all
        alert("Couldn't reach the server. Please check your connection and try again.");
    } finally {
        // 4. Always put the button back to normal, whatever happened
        generateButton.disabled = false;
        generateButton.textContent = "Generate Proposal";
    }
});


const logoInput = document.querySelector('input[type="file"]');
const logoPreview = document.querySelector("#logoPreview");

logoInput.addEventListener("change", function () {
  const file = logoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      logoPreview.src = event.target.result;
      logoPreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});


const downloadButton = document.querySelector(".output-section button");

downloadButton.addEventListener("click", function () {
  window.print();
});

const recordButton = document.querySelector("#recordButton");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// Some browsers (e.g. Firefox) don't support voice input - hide the button there instead of crashing
if (!SpeechRecognition) {
  recordButton.style.display = "none";
} else {
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;

  recordButton.addEventListener("click", function () {
    recognition.start();
    recordButton.textContent = "🎙️ Listening...";
  });

  recognition.addEventListener("result", function (event) {
    let transcript = "";
    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript + " ";
    }
    inputTextarea.value = transcript;
  });

  recognition.addEventListener("end", function () {
    recordButton.textContent = "🎤 Record";
  });
}

