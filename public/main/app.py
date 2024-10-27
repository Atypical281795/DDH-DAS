from flask import Flask, request, jsonify
from flask_cors import CORS  # 導入 CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)  # 允許所有來源的請求

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')  # 允許所有來源
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')  # 允許的標頭
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')  # 允許的請求方法
    return response

@app.route('/activate_env', methods=['POST', 'OPTIONS'])  # 確保支持 OPTIONS 方法
def activate_env():
    if request.method == 'OPTIONS':
        return jsonify({'success': True}), 200  # 對預檢請求返回 200 OK
    env_name = "test"
    command = f"activate {env_name}"
    subprocess.call(command, shell=True)
    return jsonify({"success": True})

@app.route('/run_ahe', methods=['POST'])
def run_ahe():
    data = request.json
    image_path = data['imagePath']
    
    # 在這裡調用 AHE.py
    output_path = r"C:\wamp64\www\DDHDAS\public\img\enhance\enhanced_image.bmp"
    # 假設 AHE.py 是一個函數，您可以在這裡調用它
    process_image(image_path)  # 您需要根據實際情況調整

    return jsonify({"success": True, "outputPath": output_path})

@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No file part'})
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No selected file'})
    
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # 在這裡執行您的 Python 程式碼
    subprocess.run(['python', 'AHE.py', file_path])

    return jsonify({'success': True, 'image_path': file_path})

if __name__ == '__main__':
    app.run(port=5000)
