let ws = new WebSocket('wss://stp-interactive-sd-7305e236bdf9.herokuapp.com/:443');
let prompt = document.getElementById("promptInput");
let text = document.getElementById("textField");
let title = document.getElementById("title");
let submitBtn = document.querySelector('input[type="button"]');

// Question sets controlled by TouchDesigner `switch1`
const questionsSwitch0 = [
  {question: "What is your fear?", example: "e.g. Being forgotten by those I love, becoming invisible in a world that moves too fast"},
  {question: "What are you afraid of?", example: "e.g. Losing control of my body, watching myself disappear piece by piece"},
  {question: "What do you hope?", example: "e.g. To find true connection beyond screens, to touch something real and eternal"},
  {question: "What do you dream?", example: "e.g. A world without boundaries where bodies dissolve into light and we all become one"},
];

const questionsSwitch1 = [
  {question: "What is your most transgressive desire?", example: "e.g. To dissolve into pure data, to become something inhuman and free from flesh"},
  {question: "Who do you want to be?", example: "e.g. Someone unrecognizable, a version of myself that exists only in motion and light"},
  {question: "What are you afraid of?", example: "e.g. The silence after the noise stops, the moment when the performance ends and I'm alone"},
  {question: "What makes you feel whole?", example: "e.g. Movement without thought, surrendering completely to the rhythm of my body"},
  {question: "What is consciousness?", example: "e.g. A beautiful glitch in the system, the ghost inside the machine learning to dream"},
  {question: "What do you want to see?", example: "e.g. Bodies becoming light, flesh transformed into digital ecstasy, the impossible made real"},
  {question: "What mask are you wearing?", example: "e.g. The one I can't remove anymore, the face I show the world that has become my truth"},
  {question: "How much are you worth?", example: "e.g. More than I dare to believe, less than I pretend, exactly what the algorithm says I am"},
];

let currentIndex = 0;
let currentSet = questionsSwitch0;
let currentStage = null; // 1 or 2 when known

function setTitleAndPlaceholder(textVal) {
  console.log('Setting question to:', textVal);
  // Be resilient: use #title if present, else fallback to first h1
  const titleEl = document.getElementById("title") || document.querySelector("h1#title, .container h1, h1");
  const promptEl = document.getElementById("promptInput");
  if (!titleEl) console.warn('Title element not found. Ensure <h1 id="title"> exists.');
  
  if (typeof textVal === 'object') {
    if (titleEl) titleEl.textContent = textVal.question;
    if (promptEl) promptEl.placeholder = textVal.example;
  } else {
    if (titleEl) titleEl.textContent = textVal;
    if (promptEl) promptEl.placeholder = textVal;
  }
}

function setBodyStageClass(stage) {
  const body = document.body;
  if (!body) return;
  body.classList.remove('stage-1', 'stage-2');
  body.classList.add(stage === 2 ? 'stage-2' : 'stage-1');
}

function updateStageUI(stage) {
  const promptInfo = document.querySelector('.prompt-info');
  const submitButton = document.querySelector('input[type="button"]');
  
  if (stage === 1) {
    if (promptInfo) promptInfo.innerHTML = "Your answer will be part of the digital collective.";
    if (submitButton) submitButton.value = "Share Your Answer";
  } else {
    if (promptInfo) promptInfo.innerHTML = "Each prompt lasts 20 seconds.<br>Please wait for your turn after submitting.";
    if (submitButton) submitButton.value = "Submit Prompt";
  }
}

function showNextQuestion() {
  currentIndex = (currentIndex + 1) % currentSet.length;
  setTitleAndPlaceholder(currentSet[currentIndex]);
}

function applySwitchState(val) {
  // Normalize val to number 0/1
  const n = typeof val === 'string' ? Number(val) : val;
  const nextStage = (n === 1) ? 2 : 1;
  if (currentStage !== nextStage) {
    currentStage = nextStage;
    console.log(`Stage ${currentStage} - switched (switch1=${n})`);
    currentSet = (currentStage === 2) ? questionsSwitch1 : questionsSwitch0;
    // Reset to first question when stage changes
    currentIndex = 0;
    setTitleAndPlaceholder(currentSet[currentIndex]);
    setBodyStageClass(currentStage);
    updateStageUI(currentStage);
  } else {
    console.log(`Stage ${currentStage} - repeat (switch1=${n})`);
  }
}

// Show a styled popup message using CSS class
function showSuccessPopup(message) {
  let popup = document.createElement('div');
  popup.className = 'success-popup';
  popup.textContent = message;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
    if (submitBtn) submitBtn.disabled = false;
  }, 1500);
}

// Show a modal with a refresh button
function showRefreshModal(message) {
  // Remove existing modal if present
  let existing = document.getElementById('refresh-modal');
  if (existing) existing.remove();

  let modal = document.createElement('div');
  modal.id = 'refresh-modal';

  let content = document.createElement('div');
  content.id = 'refresh-modal-content';
  content.innerHTML = `<div>${message}</div>`;

  let btn = document.createElement('button');
  btn.textContent = 'Refresh Page';
  btn.onclick = () => window.location.reload();

  content.appendChild(btn);
  modal.appendChild(content);
  document.body.appendChild(modal);
}

function sendPrompt() {
  if (prompt.value === "") {
    text.style.display = "inline";
  } else {
    if (submitBtn) submitBtn.disabled = true;
    console.log(prompt.value);
    text.style.display = "none";
    ws.send(prompt.value);
    prompt.value = "";
    showSuccessPopup("Submit successfully! Your prompt added to the queue :)");
    // Change to next question after submit
    showNextQuestion();
  }
}

ws.addEventListener('open', () => {
  console.log('Socket connection open - ready for stage switching');
  ws.send('pong');
  // Request current stage from server
  ws.send(JSON.stringify({type: 'request_stage'}));
});

function parseSwitch1Payload(raw) {
  try {
    if (raw == null) return null;
    // Already an object with switch1
    if (typeof raw === 'object' && Object.prototype.hasOwnProperty.call(raw, 'switch1')) {
      return Number(raw.switch1);
    }
    if (typeof raw === 'string') {
      const s = raw.trim();
      // Bare numbers like "1" or "1.0"
      if (/^(0|1)(\.0)?$/.test(s)) return Number(s);
      // Try JSON.parse directly
      try {
        const obj = JSON.parse(s);
        if (obj && Object.prototype.hasOwnProperty.call(obj, 'switch1')) return Number(obj.switch1);
      } catch {}
      // Normalize single quotes and parse again
      const normalized = s.replace(/^'|'$/g, '').replace(/'/g, '"');
      try {
        const obj2 = JSON.parse(normalized);
        if (obj2 && Object.prototype.hasOwnProperty.call(obj2, 'switch1')) return Number(obj2.switch1);
      } catch {}
      // Regex extract
      const m = normalized.match(/"?switch1"?\s*:\s*([0-9]+(?:\.[0-9]+)?)/i);
      if (m) return Number(m[1]);
    }
  } catch {}
  return null;
}

function handleWSMessageData(data) {
  if (data === 'ping') {
    console.log('got ping');
    ws.send('pong');
    return;
  }
  const val = parseSwitch1Payload(data);
  if (val === 0 || val === 1 || val === 0.0 || val === 1.0) {
    applySwitchState(Number(val));
  } else {
    // Check if it's a stage response
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      if (parsed && parsed.type === 'current_stage' && parsed.stage !== undefined) {
        applySwitchState(Number(parsed.stage));
        return;
      }
    } catch (e) {}
    console.log('message (unparsed)', data);
  }
}

ws.addEventListener('message', (message) => {
  if (!message) return;
  const d = message.data;
  if (d instanceof Blob) {
    d.text().then(handleWSMessageData).catch((e) => console.log('blob parse error', e));
  } else {
    handleWSMessageData(d);
  }
});

ws.addEventListener('error', (error) => {
  console.error('error disconnect', error);
  showRefreshModal('Please refresh the page to join back :)');
});

ws.addEventListener('close', () => {
  console.log('Socket connection closed');
  showRefreshModal('If your prompt is not appearing, refresh to join back :)');
});

document.addEventListener('DOMContentLoaded', () => {
  // Initialize with switch==0 behavior until TD sends a value
  applySwitchState(0);
});

//Original

// let ws = new WebSocket('wss://stp-interactive-sd-7305e236bdf9.herokuapp.com/:443');
// let prompt = document.getElementById("promptInput");
// let text = document.getElementById("textField");

// function sendPrompt() {
//   if (prompt.value == "") {
//     text.style.display = "inline";
//   } 
//   else {
//     console.log(prompt.value);
//     text.style.display = "none";
//     ws.send(prompt.value);
//     prompt.value = "";
//   }
// }

// ws.addEventListener('open', (event) => {
//   console.log('Socket connection open');
//   // alert('Successfully connected to socket server 🎉');
//   ws.send('pong');
// });

// ws.addEventListener('message', (message) => {
//   if (message && message.data) {
//     if (message.data === "ping") {
//       console.log("got ping");
//       ws.send("pong");
//       return;
//     }
    
//   console.log("message", message)}
// });

// ws.addEventListener('error', (error) => {
//     console.error('error disconnect', error);
//     alert('Please REFRESH the page to join back :)', error);
// });

// ws.addEventListener('close', (event) => {
//     console.log('Socket connection closed');
//     alert('If your prompt is not appearing, REFRESH to join back :)');
// });

// document.addEventListener('DOMContentLoaded', () => {
//   const questions = [
//     "What is your most transgressive desire?",
//     "Who do you want to be?",
//     "Waht are you afraid of?",
//     "What makes you feel whole?",
//     "What is consciousness?",
//     "What do you want to see?",
//     "What mask are you wearing?",
//     "How much are you worth?"
//   ];

//   const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

//   const promptInput = document.getElementById('promptInput');
//   if (promptInput) {
//     promptInput.placeholder = randomQuestion;
//   }
// });
