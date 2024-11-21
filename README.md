# Emotion Detection with Teachable Machine, Flask, and ML5.js

This project demonstrates how to classify human emotions using a pre-trained model from Teachable Machine, integrated with `ML5.js` for real-time webcam-based emotion detection and static image testing. The project uses Flask as the backend and includes a Python testing script to evaluate the performance of the model on static images.

## Installation Instructions

### 1. Install [Python 3.8](https://www.python.org/downloads/release/python-380/)
Download and install Python 3.8 from the official website: [https://www.python.org/downloads/release/python-380/](https://www.python.org/downloads/release/python-380/).

### 2. Install Required Python Packages
Open your terminal, navigate to your project directory, and run the following commands to install the necessary packages:

```bash
pip install Flask
pip install flask-cors
```

### 3. Start the Flask Server
To run the server, execute the following command in the project directory:
```bash
python app.py
```
This will start the Flask server, and you can access the project by opening your browser and navigating to:

```bash
http://localhost:5000/
```

### 4. Test Model Performance Using Python Script
This project includes a Python script (`test_model.py`) to test the performance of the pre-trained model from Teachable Machine. The script uses TensorFlow to load the model and Pillow to load testing images from the `./images/` directory. It measures the success rate by determining if the model correctly classifies images representing negative emotions such as angry, sad, and disgust.

#### How to Run the Python Testing Script:
1. Ensure that you have placed your test images in the `./images/` directory.
2. Run the script with the following command:
```bash
python testing.py
```

The script will output:
- The total number of images processed.
- The total number of classification failures (i.e., images classified as happy or neutral).
- The total number of classification successes (i.e., images classified as angry, sad, or disgust).
- The final success rate.

### 5. Real-Time Emotion Detection via Webcam
The `sketch.js` script uses the webcam to capture real-time video input and classify facial expressions. The classifier uses a Teachable Machine model through ML5.js to detect emotions and determine if the user’s expression reflects "frustration" (angry, sad, or disgust).

#### How to Run:
1. Run the Python Flask server
2. visit http://localhost:5000/
3. When you run this file, the system will request permission to access your webcam. After granting permission, the webcam will capture your facial expressions in real time, classify them, and track the success rate of frustration detection.

## How It Works

### Success and Failure Criteria:
- **Success:** When the model classifies the emotion as "frustration" (i.e., angry, sad, or disgust).
- **Failure:** When the model classifies the emotion as either neutral or happy.
  
The final success rate is calculated based on the total number of classifications.

### Models:
The project uses a pre-trained model from Teachable Machine. The model is designed to recognize emotions such as angry, sad, disgust, neutral, and happy. You can easily replace the current model with your own pre-trained model.

### Usage Notes:
- **Real-Time Webcam Classification (`sketch.js`):** This captures real-time facial expressions from your webcam and classifies the emotions in real time.
- **Testing with Python (`testing.py`):** This script loads images from the `images` directory and evaluates the performance of the model by calculating the success rate.

## Project Structure

```
project-directory/
├── app.py                     # Flask backend
├── models/
│   ├── keras_model.h5          # Pre-trained model from Teachable Machine
│   ├── labels.txt              # Class labels corresponding to the model
├── images/                     # Directory for test images
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...                     # Other images representing negative emotions
├── static/
│   ├── index.html              # Frontend HTML file
│   ├── sketch.js               # Static image classification script
│   ├── styles.css              # Custom styles for the web interface
│   └── chatbot-icon.png        # Chatbot icon for the web interface
├── test_model.py               # Python script to test model performance
```

## Running the Project

1. **Start the Flask Server**:
   Run `python app.py` to start the backend.

2. **Use Real-Time Webcam Detection**:
   Edit `index.html` to use `sketch.js`, and then load the page in your browser.

3. **Run the Python Testing Script**:
   Run `python test_model.py` to evaluate model performance on test images.