import os

# 指定路徑
path = r"C:\wamp64\www\DDHDAS\public\main\img\output\left"

# 遍歷路徑中的所有文件
for filename in os.listdir(path):
    # 確保是文件而不是文件夾
    if os.path.isfile(os.path.join(path, filename)):
        # 分離文件名和擴展名
        name, ext = os.path.splitext(filename)
        # 新的文件名
        new_name = f"{name}_output{ext}"
        # 重新命名文件
        os.rename(os.path.join(path, filename), os.path.join(path, new_name))

print("文件重新命名完成。")