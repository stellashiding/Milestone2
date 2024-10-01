from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='static')
CORS(app)  # Enable CORS for all routes

# Serve the index.html at the root
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# Serve other static files (JS, CSS)
@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory(app.static_folder, path)

# Dummy chatbot endpoint
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({'reply': 'I\'m here to help you. How are you feeling today?'}), 400

    # Generate a dummy response (You can integrate Hugging Face and LangChain here in the future)
    bot_reply = f"You said: '{user_message}'. I'm here to support you."

    return jsonify({'reply': bot_reply})

if __name__ == '__main__':
    app.run(debug=True)
