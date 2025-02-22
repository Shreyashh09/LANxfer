from flask import Flask, render_template, request, jsonify, send_from_directory
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the uploads directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_files')
def get_files():
    """Returns a list of files in the upload directory"""
    files = os.listdir(app.config['UPLOAD_FOLDER'])
    return jsonify(files)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serves uploaded files"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handles file uploads"""
    if 'file' not in request.files:
        return "No file part", 400
    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400

    file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
    return "File uploaded successfully!", 200

if __name__ == '__main__':
    app.run(debug=True)
