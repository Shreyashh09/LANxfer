from flask import Flask, render_template, request, jsonify, send_from_directory
import os
from datetime import datetime
import time

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the uploads directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def get_file_info(filename):
    """Get detailed file information including timestamps and size"""
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    stats = os.stat(file_path)
    
    return {
        'name': filename,
        'size': stats.st_size,  # File size in bytes
        'created': stats.st_ctime,  # Creation timestamp
        'modified': stats.st_mtime,  # Last modification timestamp
        'accessed': stats.st_atime,  # Last access timestamp
        # Format timestamps for display
        'created_fmt': datetime.fromtimestamp(stats.st_ctime).strftime('%Y-%m-%d %H:%M:%S'),
        'modified_fmt': datetime.fromtimestamp(stats.st_mtime).strftime('%Y-%m-%d %H:%M:%S'),
        # Format file size for display
        'size_fmt': format_file_size(stats.st_size)
    }

def format_file_size(size):
    """Convert file size in bytes to human-readable format"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size < 1024:
            return f"{size:.1f} {unit}"
        size /= 1024
    return f"{size:.1f} PB"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_files')
def get_files():
    """Returns a list of files with detailed information"""
    try:
        files = []
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            try:
                file_info = get_file_info(filename)
                files.append(file_info)
            except OSError as e:
                print(f"Error getting info for file {filename}: {e}")
                continue
        
        # Sort parameter handling
        sort_by = request.args.get('sort', 'name')  # Default sort by name
        sort_order = request.args.get('order', 'asc')  # Default ascending order
        
        # Sort files based on request parameters
        reverse = sort_order.lower() == 'desc'
        files.sort(key=lambda x: x[sort_by], reverse=reverse)
        
        return jsonify(files)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serves uploaded files"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handles file uploads"""
    try:
        if 'file' not in request.files:
            return "No file part", 400
        
        file = request.files['file']
        if file.filename == '':
            return "No selected file", 400

        # Get the file path
        filename = file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save the file
        file.save(file_path)
        
        # Get and return the file info
        file_info = get_file_info(filename)
        return jsonify({
            'message': "File uploaded successfully!",
            'file': file_info
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)