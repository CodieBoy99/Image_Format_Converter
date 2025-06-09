import os
import zipfile  # Correctly importing zipfile
from flask import Flask, request, render_template, jsonify, send_file
from PIL import Image

app = Flask(__name__, static_folder="static", template_folder="templates")

# Folder Setup
UPLOAD_FOLDER = "Image_Input"
OUTPUT_FOLDER = "Image_Output"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Supported image formats
formats = {
    "jpg": "JPEG",
    "png": "PNG",
    "webp": "WEBP",
    "bmp": "BMP",
    "tiff": "TIFF",
    "gif": "GIF",
}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/convert", methods=["POST"])
def convert_images():
    files = request.files.getlist("images")
    output_format = request.form["format"].lower()
    quality = int(request.form["quality"])

    if output_format not in formats:
        return jsonify({"error": "Invalid format selected"}), 400

    converted_files = []

    for file in files:
        input_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(input_path)

        img = Image.open(input_path)
        output_path = os.path.join(OUTPUT_FOLDER, f"{os.path.splitext(file.filename)[0]}.{output_format}")
        img.save(output_path, format=formats[output_format], quality=quality)
        converted_files.append(output_path)

    # If multiple files, zip them
    if len(converted_files) > 1:
        zip_path = os.path.join(OUTPUT_FOLDER, "converted_images.zip")
        with zipfile.ZipFile(zip_path, "w") as zipf:
            for file in converted_files:
                zipf.write(file, os.path.basename(file))
        return send_file(zip_path, as_attachment=True)

    return send_file(converted_files[0], as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)