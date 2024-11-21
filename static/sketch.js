let classifier;
let video;
let currentEmotion = '';
let previousEmotion = '';
let emotionDetectedTime = 0;

let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function preload() {
  console.log("Preloading models...");
  
  // Load the Teachable Machine model with proper callback structure
  const modelURL = 'https://teachablemachine.withgoogle.com/models/4tsQGMC31/model.json';
  classifier = ml5.imageClassifier(modelURL, () => {
    console.log("Emotion classifier model loaded successfully!");
    // Start classifying the video once the model is loaded
    classifyVideo();
  });
  
  // Load the FaceMesh model
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  console.log("Setting up...");
  createCanvas(640, 480);
  
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  
  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // Draw all the tracked face points
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 2);
    }
  }

  // Display the current emotion
  fill(255);
  noStroke();
  textSize(24);
  textAlign(CENTER);
  text(currentEmotion, width / 2, height - 20);
}

function classifyVideo() {
  if (classifier && video) {
    classifier.classify(video)
      .then(results => {
        gotResult(results);
        classifyVideo(); // Continue classification
      })
      .catch(error => {
        console.error("Actual error during classification:", error);
        setTimeout(classifyVideo, 1000); // Retry after 1 second
      });
  } else {
    console.warn("Classifier or video not ready yet.");
    setTimeout(classifyVideo, 1000); // Retry after 1 second
  }
}

function gotResult(results) {
  // Check if results are available
  if (!results || results.length === 0) {
    console.warn("No results returned from classifier.");
    return;
  }

  // Get the label with the highest confidence (results[0])
  let label = results[0].label;
  let confidence = results[0].confidence;
  
  // Log the result properly
  console.log(`Detected emotion: ${label} (${(confidence * 100).toFixed(2)}%)`);

  // Update the current emotion
  currentEmotion = label;

  // Check for negative emotions from the classifier
  if (isNegativeEmotion(label)) {
    triggerEmotionalSupportIfNeeded(label);
  }
}

function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;

  // Analyze facial expressions
  if (faces.length > 0) {
    analyzeFacialExpressions(faces[0]);
  }
}

function analyzeFacialExpressions(face) {
  // Example analysis: Detect if mouth is frowning (sadness)
  let keypoints = face.keypoints;
  let leftMouthCorner = keypoints.find(point => point.name === "lipsUpperOuter");
  let rightMouthCorner = keypoints.find(point => point.name === "lipsUpperOuterRight");
  let topMouth = keypoints.find(point => point.name === "lipsUpperInner");
  let bottomMouth = keypoints.find(point => point.name === "lipsLowerInner");

  if (leftMouthCorner && rightMouthCorner && topMouth && bottomMouth) {
    // Calculate mouth width and height
    let mouthWidth = dist(leftMouthCorner.x, leftMouthCorner.y, rightMouthCorner.x, rightMouthCorner.y);
    let mouthHeight = dist(topMouth.x, topMouth.y, bottomMouth.x, bottomMouth.y);

    // Calculate mouth aspect ratio (MAR)
    let MAR = mouthHeight / mouthWidth;

    // Threshold for detecting frown (adjust this value based on testing)
    let frownThreshold = 0.3;

    if (MAR < frownThreshold) {
      console.log("Facial landmark analysis detected negative emotion: sadness");
      currentEmotion = 'sad';
      triggerEmotionalSupportIfNeeded('sad');
    }
  }
}

function isNegativeEmotion(emotion) {
  return emotion === 'angry' || emotion === 'sad' || emotion === 'disgust';
}

function triggerEmotionalSupportIfNeeded(emotion) {
  if (previousEmotion === emotion) {
    if (millis() - emotionDetectedTime > 2000) {
      triggerEmotionalSupport(emotion);
    }
  } else {
    previousEmotion = emotion;
    emotionDetectedTime = millis();
  }
}

function triggerEmotionalSupport(emotion) {
  console.log(`Triggering emotional support for emotion: ${emotion}`);
  alert(`It seems you're feeling ${emotion}. Remember, it's okay to feel this way. Take a deep breath, and know that you're not alone.`);
  previousEmotion = '';
  emotionDetectedTime = 0;
}