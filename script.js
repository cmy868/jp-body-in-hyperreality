let ws = new WebSocket('wss://stp-interactive-sd-7305e236bdf9.herokuapp.com/:443');
let prompt = document.getElementById("promptInput");
let text = document.getElementById("textField");
let title = document.getElementById("title");
let submitBtn = document.querySelector('input[type="button"]');

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
    showSuccessPopup("Submit successfully!");
  }
}

ws.addEventListener('open', () => {
  console.log('Socket connection open');
  ws.send('pong');
});

ws.addEventListener('message', (message) => {
  if (message && message.data) {
    if (message.data === "ping") {
      console.log("got ping");
      ws.send("pong");
      return;
    }
    console.log("message", message);
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
  // No need to update title or placeholder
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
