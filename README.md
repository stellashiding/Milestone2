# Emotion Detection with Teachable Machine and ML5.js

This project demonstrates how to classify human emotions using a pre-trained model from Teachable Machine, integrated with `ML5.js`. The project supports testing both static images and real-time webcam-based emotion detection.

## Installation Instructions

To set up the project on your local machine, follow these steps:

### 1. Install [Node.js](https://nodejs.org/en/)
Download and install Node.js from the official website: [https://nodejs.org/en/](https://nodejs.org/en/).

### 2. Install Express
In your project directory, open the terminal and run the following command to install Express:
```bash
npm install express
```

### 3. Start the Server
Run the server by executing the following command:
```bash
npm install express
```

### 4. Open the Project in Your Browser
Once the server is running, open your browser and navigate to:
```bash
http://localhost:3000/
```


### a. sketch.js – Testing with Static Images
This script allows you to test the model by loading and classifying a set of static images from the images directory. It calculates the success rate by determining if the model correctly classifies images as "frustration" (angry, sad, or disgust).

How to Run sketch.js:
Open index.html in a text editor.
Comment out the script reference to sketch_cam.js.
Uncomment the script reference to sketch.js.
Save your changes and refresh your browser.
Once the changes are made, the project will load images from the images directory and classify them. At the end of the process, a success rate will be displayed.

### b. sketch_cam.js – Real-Time Emotion Detection via Webcam
This script uses the webcam to capture real-time video input and classify facial expressions. The classifier uses a Teachable Machine model through ML5.js to detect emotions and determines if the user’s expression reflects "frustration."

How to Run sketch_cam.js:
Open index.html in a text editor.
Ensure that the script reference to sketch_cam.js is uncommented.
Save your changes and refresh your browser.
When you run this file, the system will request permission to access your webcam. After granting permission, the webcam will capture your facial expressions in real time, classify them, and track the success rate of frustration detection.

How It Works
Success and Failure Criteria
The system tracks two metrics:
Success: When the model classifies the emotion as "frustration" (i.e., angry, sad, or disgust).
Failure: When the model classifies the emotion as either neutral or happy.
The final success rate is calculated based on the total number of classifications and displayed at the end of the test.
Models
This project uses a pre-trained model from Teachable Machine. The model is designed to recognize common emotions such as angry, sad, disgust, neutral, and happy.

Usage Notes
Static Image Classification (sketch.js): Allows you to test pre-loaded images and see how accurately the model classifies emotions.
Real-Time Webcam Classification (sketch_cam.js): Captures real-time facial expressions from your webcam and classifies the emotions in real time.
Success Rate: Both scripts track how accurately the model detects frustration (angry, sad, or disgust).
Feel free to explore, modify, and extend the project by integrating new models, testing with different images, or applying it to other use cases.