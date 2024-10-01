# test_model.py

import os
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image, ImageOps
import numpy as np

# ----------------------------- Configuration -----------------------------

# Path to the trained Keras model (.h5 file)
MODEL_PATH = os.path.join('models', 'keras_model.h5')  # Use os.path.join for cross-platform compatibility

# Path to the directory containing test images
IMAGE_DIR = 'images'  # Relative path to the image directory

# Path to the labels file
LABELS_PATH = os.path.join('models', 'labels.txt')  # Ensure labels.txt is in the 'models' directory

# Define which labels are considered failures
FAILURE_LABELS = ['neutral', 'happy']

# Image size expected by the model (width, height)
IMAGE_SIZE = (224, 224)  # Update based on your model's requirements

# ----------------------------- End Configuration --------------------------

def load_trained_model(model_path):
    """
    Load the trained Keras model from the specified path.
    """
    if not os.path.exists(model_path):
        print(f"Error: Model file '{model_path}' not found.")
        exit(1)
    try:
        model = load_model(model_path, compile=False)
        print("Model loaded successfully.")
        model.summary()  # Optional: Print model architecture for verification
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        exit(1)

def load_labels(labels_path):
    """
    Load and process labels from the labels.txt file.
    Removes numerical prefixes from each line.
    """
    try:
        with open(labels_path, 'r') as f:
            # Split each line by space and take the second part as the label
            CLASS_LABELS = [line.strip().split(' ', 1)[1] for line in f.readlines()]
        print("Labels loaded successfully.")
        print("Class Labels:", CLASS_LABELS)
        return CLASS_LABELS
    except FileNotFoundError:
        print(f"Error: Labels file '{labels_path}' not found.")
        exit(1)
    except IndexError:
        print(f"Error: Labels file '{labels_path}' is not in the expected format.")
        exit(1)

def preprocess_image(image_path, target_size):
    """
    Load and preprocess the image for prediction.
    """
    try:
        img = Image.open(image_path).convert('RGB')
        img = ImageOps.fit(img, target_size, Image.Resampling.LANCZOS)
        img_array = np.asarray(img) / 127.5 - 1  # Normalize to [-1, 1] if your model expects it
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        return img_array
    except Exception as e:
        print(f"Error processing image '{image_path}': {e}")
        return None

def classify_image(model, img_array, class_labels):
    """
    Use the model to predict the class of the image.
    Returns the predicted label.
    """
    try:
        predictions = model.predict(img_array)
        predicted_index = np.argmax(predictions, axis=1)[0]
        predicted_label = class_labels[predicted_index]
        confidence_score = predictions[0][predicted_index]
        return predicted_label, confidence_score
    except Exception as e:
        print(f"Error during prediction: {e}")
        return None, None

def main():
    # Load the trained model
    model = load_trained_model(MODEL_PATH)

    # Load and process labels
    CLASS_LABELS = load_labels(LABELS_PATH)

    # Verify that CLASS_LABELS length matches model output
    if model.output_shape[-1] != len(CLASS_LABELS):
        print("Error: The number of CLASS_LABELS does not match the model's output classes.")
        print(f"Model output classes: {model.output_shape[-1]}, CLASS_LABELS provided: {len(CLASS_LABELS)}")
        exit(1)

    # Initialize counters
    total_files = 0
    failure_count = 0
    success_count = 0

    # Iterate through the image directory
    if not os.path.exists(IMAGE_DIR):
        print(f"Error: Image directory '{IMAGE_DIR}' does not exist.")
        exit(1)

    print("\nStarting classification of test images...\n")

    for filename in os.listdir(IMAGE_DIR):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            total_files += 1
            image_path = os.path.join(IMAGE_DIR, filename)
            img_array = preprocess_image(image_path, IMAGE_SIZE)
            if img_array is None:
                print(f"Skipping image '{filename}' due to preprocessing error.")
                continue
            predicted_label, confidence_score = classify_image(model, img_array, CLASS_LABELS)
            if predicted_label is None:
                print(f"Skipping image '{filename}' due to prediction error.")
                continue
            print(f"Image: {filename} | Predicted: {predicted_label} | Confidence: {confidence_score*100:.2f}%")
            if predicted_label in FAILURE_LABELS:
                failure_count += 1
            else:
                success_count += 1

    # Calculate success rate
    success_rate = (success_count / total_files) * 100 if total_files > 0 else 0

    # Display results
    print("\n===== Test Results =====")
    print(f"Total number of files: {total_files}")
    print(f"Total number of failures: {failure_count}")
    print(f"Total number of successes: {success_count}")
    print(f"Success rate: {success_rate:.2f}%")
    print("========================")

if __name__ == "__main__":
    main()
