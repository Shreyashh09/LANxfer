from flask import Flask, request, send_from_directory, render_template
import os

app = Flask(__name__, static_folder="static")
UPLOAD_FOLDER = "./uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # ✅ Corrected variable reference

@app.route('/')
def home():
    return render_template("index.html")  # ✅ Serve from templates (fixes script.js issue)

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file:
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        return "File uploaded successfully!"
    return "Failed to upload file."

@app.route('/files')
def list_files():
    files = os.listdir(UPLOAD_FOLDER)
    return {"files": files}

@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # Accessible over LAN
