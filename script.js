let ws = new WebSocket('wss://stp-interactive-sd-7305e236bdf9.herokuapp.com/:443');
let prompt = document.getElementById("promptInput");
let text = document.getElementById("textField");
let title = document.getElementById("title");

// Actual prepared prompts from Jacob's Pillow and dance history
let preparedPrompts = [
  // Specific artists/moments from Jacob's Pillow history
  "Ted Shawn, shirtless dancing forcefully in a barn",
  "Ruth St. Denis swirling fabric in an open field",
  "Mikhail Baryshnkov stamping his feet on bubblewrap",
  "Lil Buck jookin to The Dying Swan",
  "Indigenous Enterprise in the Men's Fancy Dance against the Berkshire Hills",
  "Alvin Ailey dancing his Revelations",
  "Martha Graham performing her Lamentation",
  "Savion Glover tap dancing for a crowd",
  "Ted Shawn and His Men Dancers dancing around the Jacob's Pillow campus",
  "Performers dancing across the Henry J. Leir Stage",
  "Artists posing on the Pillow Rock",
  
  // Snapshots from dance history generally
  "Breakdancers battling on the streets of New York City",
  "Louis XIV dancing a minuet in the 18th century French court",
  "Lindy hopper flying through the air in Harlem's Savoy Ballroom",
  "Flamenco tablao in 19th century Andalusia",
  "Bharatanatyam mudras in 18th century India",
  "Tango dancers in a smoky nightclub",
  "Fred Astaire and Ginger Rogers in Technicolor",
  "Aerial silks artist spinning through the sky",
  
  // Absurd prompt ideas
  "Tap dancing across the surface of the moon",
  "Classical ballet underwater",
  "Modern dancer in a grocery store",
  "Ballerina in cyberspace"
];

// DOM elements
const preparedPromptsContainer = document.getElementById("preparedPrompts");
const customInputSection = document.querySelector('.custom-input-section h2');

// Flag to track if we're in editing mode
let isEditingMode = false;

// Initialize the app
function initializeApp() {
  renderPreparedPrompts();
  setupEventListeners();
}

// Render prepared prompts in the list
function renderPreparedPrompts() {
  preparedPromptsContainer.innerHTML = '';
  
  preparedPrompts.forEach((promptText, index) => {
    const promptItem = document.createElement('div');
    promptItem.className = 'prompt-item';
    promptItem.textContent = promptText;
    promptItem.dataset.index = index;
    
    promptItem.addEventListener('click', () => {
      showConfirmationDialog(promptText, index);
    });
    
    preparedPromptsContainer.appendChild(promptItem);
  });
}

// Show confirmation dialog when clicking a prepared prompt
function showConfirmationDialog(promptText, index) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  
  // Create dialog
  const dialog = document.createElement('div');
  dialog.className = 'confirmation-dialog';
  dialog.innerHTML = `
    <h3>Use This Prompt?</h3>
    <p>"${promptText}"</p>
    <div class="confirmation-buttons">
      <button class="confirm-btn">Send Directly</button>
      <button class="modify-btn">Modify First</button>
      <button class="cancel-btn">Cancel</button>
    </div>
  `;
  
  // Add event listeners
  const confirmBtn = dialog.querySelector('.confirm-btn');
  const modifyBtn = dialog.querySelector('.modify-btn');
  const cancelBtn = dialog.querySelector('.cancel-btn');
  
  confirmBtn.addEventListener('click', () => {
    // Send the prompt directly
    sendPromptDirectly(promptText);
    closeDialog();
  });
  
  modifyBtn.addEventListener('click', () => {
    // Copy to textarea for modification
    if (prompt) {
      prompt.value = promptText;
      prompt.placeholder = "Edit your prompt here and click Submit when ready...";
      isEditingMode = true;
      
      // Change the section header text
      if (customInputSection) {
        customInputSection.textContent = "Edit your prompt below and submit:";
      }
      
      prompt.focus();
      prompt.setSelectionRange(prompt.value.length, prompt.value.length);
    }
    closeDialog();
  });
  
  cancelBtn.addEventListener('click', closeDialog);
  
  // Close dialog when clicking overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeDialog();
    }
  });
  
  function closeDialog() {
    document.body.removeChild(overlay);
  }
  
  // Add to DOM
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
}

// Send prompt directly without modification
function sendPromptDirectly(promptText) {
  console.log(promptText);
  text.style.display = "none";
  ws.send(promptText);
  updateTexts(); // Update the random question for the placeholder
  showSuccessNotification();
}

// Show success notification
function showSuccessNotification() {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = 'success-notification';
  notification.innerHTML = `
    <h3>✅ Prompt Sent Successfully!</h3>
    <p>Your prompt has been sent to the server.</p>
    <button class="ok-btn">OK</button>
  `;
  
  // Add event listeners
  const okBtn = notification.querySelector('.ok-btn');
  okBtn.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
  
  // Close notification when clicking overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
  
  // Add to DOM
  overlay.appendChild(notification);
  document.body.appendChild(overlay);
  
  // Auto-close after 3 seconds
  setTimeout(() => {
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
  }, 3000);
}

// Send prompt function (for custom input)
function sendPrompt() {
  if (prompt.value.trim() === "") {
    text.style.display = "inline";
    return;
  }
  
  console.log(prompt.value);
  text.style.display = "none";
  ws.send(prompt.value.trim());
  prompt.value = "";
  isEditingMode = false; // Exit editing mode
  
  // Reset the section header text
  if (customInputSection) {
    customInputSection.textContent = "Or write your own:";
  }
  
  updateTexts(); // Update the random question for the placeholder
  showSuccessNotification();
}

// Setup event listeners
function setupEventListeners() {
  // Enter key to submit
  if (prompt) {
    prompt.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendPrompt();
      }
    });
  }
}

// Fantastical dance prompts for placeholders and titles
const questions = [
  "Dancers floating through a crystal palace in the clouds",
  "Ballet dancers performing on the rings of Saturn",
  "Modern dancers moving through liquid light",
  "Tap dancers creating music with their feet on a rainbow bridge",
  "Contemporary dancers defying gravity in a dream forest",
  "Classical ballerinas dancing with fireflies in a moonlit garden",
  "Hip-hop dancers battling in a neon-lit cyberpunk city",
  "Flamenco dancers swirling through a storm of rose petals"
];

let lastQuestionIndex = -1;

function getNewQuestion() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * questions.length);
  } while (newIndex === lastQuestionIndex);
  lastQuestionIndex = newIndex;
  return questions[newIndex];
}

function updateTexts() {
  const question = getNewQuestion();
  if (prompt && !isEditingMode) {
    prompt.placeholder = question;
  }
  if (title) {
    title.textContent = question;
  }
}

// WebSocket event listeners
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  updateTexts(); // Set the initial texts
});
