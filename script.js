let ws = new WebSocket('wss://stp-interactive-sd-7305e236bdf9.herokuapp.com/:443');
let prompt = document.getElementById("promptInput");
let text = document.getElementById("textField");
let title = document.getElementById("title");
let submitBtn = document.querySelector('input[type="button"]');

// Show a styled popup message
function showSuccessPopup(message) {
  let popup = document.createElement('div');
  popup.textContent = message;
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.background = 'linear-gradient(135deg, #000066 0%, #330033 50%, #330020 100%)';
  popup.style.border = '2px solid #ff69b4';
  popup.style.borderRadius = '16px';
  popup.style.padding = '28px 48px';
  popup.style.fontSize = '1.2em';
  popup.style.fontFamily = '"HK Grotesk", system-ui, -apple-system, sans-serif';
  popup.style.color = '#ff69b4';
  popup.style.boxShadow = '0 0 24px #ff69b4, 0 0 48px #ff69b4';
  popup.style.zIndex = '9999';
  popup.style.textAlign = 'center';
  popup.style.letterSpacing = '2px';
  popup.style.textTransform = 'uppercase';
  popup.style.textShadow = '0 0 8px #ff69b4, 0 0 16px #ff69b4';
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
    if (submitBtn) submitBtn.disabled = false;
  }, 1500);
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
  alert('Please REFRESH the page to join back :)', error);
});

ws.addEventListener('close', () => {
  console.log('Socket connection closed');
  alert('If your prompt is not appearing, REFRESH to join back :)');
});

document.addEventListener('DOMContentLoaded', () => {
  // No need to update title or placeholder anymore
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
