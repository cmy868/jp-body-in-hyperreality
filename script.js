let ws = new WebSocket('wss://stp-interactive-sd-7305e236bdf9.herokuapp.com/:443');
let prompt = document.getElementById("promptInput");
let text = document.getElementById("textField");
let title = document.getElementById("title");

const questions = [
  "Use one sentence to describe your dance fantasy"
];

const place_holder = [
  "Ted Shawn and his man dancers cavorting in the fields."
];

let lastQuestionIndex = -1;

function getNewQuestion() {
  // Exclude the last used question by filtering
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * questions.length);
  } while (newIndex === lastQuestionIndex);
  lastQuestionIndex = newIndex;
  return questions[newIndex];
}

function updateTexts() {
  const question = getNewQuestion();
  // Update both the prompt placeholder and title
  if (prompt) {
    prompt.placeholder = place_holder;
  }
  if (title) {
    title.textContent = question;
  }
}

function sendPrompt() {
  if (prompt.value === "") {
    text.style.display = "inline";
  } else {
    console.log(prompt.value);
    text.style.display = "none";
    ws.send(prompt.value);
    prompt.value = "";
    updateTexts(); // Update both texts with a new question
  }
}

ws.addEventListener('open', (event) => {
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

ws.addEventListener('close', (event) => {
  console.log('Socket connection closed');
  alert('If your prompt is not appearing, REFRESH to join back :)');
});

document.addEventListener('DOMContentLoaded', () => {
  updateTexts(); // Set the initial texts
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
