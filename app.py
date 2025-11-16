from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='.')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    print("="*50)
    print("Server is running at: http://localhost:5000")
    print("Press Ctrl+C to stop the server")
    print("="*50)
    app.run(debug=True, host='0.0.0.0', port=5000)
