let classifier;
let video;
let currentEmotion = '';
let previousEmotion = '';
let emotionDetectedTime = 0;

// Chatbot Elements
let chatbotButton;
let chatbotWindow;
let chatHistory;
let chatInputField;

function preload() {
  console.log("Preloading model...");
  // Load the Teachable Machine model
  // const modelURL = 'https://teachablemachine.withgoogle.com/models/4tsQGMC31/model.json';
  const modelURL = 'https://teachablemachine.withgoogle.com/models/DNs4PzV09/model.json';
  classifier = ml5.imageClassifier(modelURL, () => {
    console.log("Model loaded successfully!");
  });
}

function setup() {
  console.log("Setting up...");
  createCanvas(640, 480);
  
  // Create a video capture
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide(); // Hide the video element, and just show the canvas
  
  // Initialize Chatbot Elements
  chatbotButton = select('#chatbotButton');
  chatbotWindow = select('#chatbotWindow');
  chatHistory = select('#chatHistory');
  chatInputField = select('#chatInput');
  
  // Start classifying the video
  classifyVideo();
}

function draw() {
  image(video, 0, 0); // Draw the video frame to canvas
  
  // Display the current emotion
  fill(255);
  textSize(24);
  textAlign(CENTER);
  text(currentEmotion, width / 2, height - 20);
}

function classifyVideo() {
  classifier.classify(video)
    .then(results => {
      gotResult(results);
      classifyVideo(); // Classify again
    })
    .catch(error => {
      console.error("Error during classification: ", error);
      classifyVideo(); // Try again in case of error
    });
}

function gotResult(results) {
  console.log("Processing classification result...");
  
  if (!results || results.length === 0) {
    console.error("No results returned from classifier.");
    return;
  }
  
  // Get the label with the highest confidence (results[0])
  let label = results[0].label;
  let confidence = results[0].confidence;
  console.log(`Detected emotion: ${label} (${(confidence * 100).toFixed(2)}%)`);
  
  currentEmotion = label;
  
  // Check for negative emotions and show chatbot button
  if (label === 'angry' || label === 'sad' || label === 'disgust') {
    if (previousEmotion === label) {
      if (millis() - emotionDetectedTime > 2000 && chatbotWindow.elt.style.display !== 'block') {
        showChatbot();
      }
    } else {
      previousEmotion = label;
      emotionDetectedTime = millis();
    }
  } else {
    previousEmotion = '';
    emotionDetectedTime = 0;
  }
}

// Function to show chatbot button
function showChatbot() {
  chatbotButton.style('display', 'flex');
}

// Toggle chatbot window on button click
function toggleChatbot() {
  chatbotWindow.style('display', chatbotWindow.elt.style.display === 'none' ? 'flex' : 'none');
  chatbotButton.style('display', 'none');
}

// Minimize chatbot
function minimizeChatbot() {
  chatbotWindow.style('display', 'none');
  chatbotButton.style('display', 'flex');
}

function sendMessage() {
  let userMessage = chatInputField.value().trim();
  if (userMessage === '') return;
  
  chatHistory.html(`${chatHistory.html()}<br>You: ${userMessage}`);
  chatInputField.value('');
  
  // Send the message to the backend
  fetch('/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: userMessage })
  })
  .then(response => response.json())
  .then(data => {
    chatHistory.html(`${chatHistory.html()}<br>Bot: ${data.reply}`);
  })
  .catch(error => {
    console.error('Error:', error);
    chatHistory.html(`${chatHistory.html()}<br>Bot: I'm sorry, I couldn't process your message.`);
  });
}

// Allow sending messages by pressing the Enter key
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}
