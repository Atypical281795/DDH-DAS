from flask import Flask, jsonify, redirect, url_for
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)  # 启用CORS

@app.route('/logout', methods=['POST'])
def logout():
    # 在這裡可以添加任何登出邏輯，例如清除會話或用戶數據
    # 启动新的Python脚本
    subprocess.Popen(['python', r"C:\wamp64\www\DDHDAS\public\login\act_login.py"])
    # 重定向到登錄頁面
    return redirect(url_for('login'))  # 確保這裡的 'login' 對應到登錄頁面的路由

@app.route('/close_window')
def close_window():
    # 返回关闭窗口的HTML页面
    return app.send_static_file('close_window.html')

@app.route('/login')
def login():
    # 重定向到登录页面
    return subprocess.Popen([r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe", r"localhost\DDHDAS\public\main\main.php"])

if __name__ == '__main__':
    app.run(port=5000)
