import cv2
import matplotlib.pyplot as plt
import os

# 设置图像文件夹路径
input_folder = r"D:\image\image_r\r_img"  # {{ edit_1 }}
output_folder = r"C:\wamp64\www\DDHDAS\public\main\img\enhance\right"  # 输出文件夹路径

# 确保输出文件夹存在
os.makedirs(output_folder, exist_ok=True)  # {{ edit_2 }}

# 遍历文件夹中的所有图像文件
for file_name in os.listdir(input_folder):  # {{ edit_3 }}
    if file_name.lower().endswith(('.png', '.jpg', '.jpeg')):  # 只处理图像文件
        img_path = os.path.join(input_folder, file_name)  # 构建完整的图像路径
        img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)

        # 检查图像是否成功加载
        if img is None:
            print(f"图像未找到: {img_path}，跳过该文件。")
            continue

        # 创建CLAHE对象
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        # 进行CLAHE均衡化
        clahe_img = clahe.apply(img)

        # 确保图像数据类型为float
        clahe_img = clahe_img.astype('float32')

        # 获取原始图像文件名并构建新的保存路径
        name, ext = os.path.splitext(file_name)  # 分离文件名和扩展名
        new_file_name = f"{name}_enhance{ext}"  # 构建新的文件名
        save_path = os.path.join(output_folder, new_file_name)  # 构建保存路径

        # 保存处理后的图像
        cv2.imwrite(save_path, clahe_img)

        print(f"已处理并保存图像: {save_path}")  # 输出处理结果

# 等待用户按下任意键
cv2.waitKey(0)
cv2.destroyAllWindows()
