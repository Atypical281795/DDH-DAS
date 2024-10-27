import os
from PIL import Image

def remove_black_background(mask):
    # 將標記影像轉換為 RGBA 格式
    mask = mask.convert("RGBA")
    data = mask.getdata()

    new_data = []
    for item in data:
        # 將黑色背景 (0, 0, 0) 轉換為透明
        if item[0] < 50 and item[1] < 50 and item[2] < 50:  # 調整閾值以適應黑色範圍
            new_data.append((0, 0, 0, 0))  # 透明
        else:
            new_data.append(new_color)  # 保留原始顏色

    mask.putdata(new_data)
    return mask

def overlay_images(img_path, mask_path, output_path):
    # 打開原始影像和標記影像
    img = Image.open(img_path).convert("RGBA")
    mask = Image.open(mask_path)

    # 去除黑色背景
    mask = remove_black_background(mask)

    # 確保標記影像與原始影像大小相同
    mask = mask.resize(img.size)

    # 將標記影像覆蓋至原始影像
    combined = Image.alpha_composite(img, mask)

    # 保存結果影像
    combined.save(output_path, "PNG")

def process_images_in_folder(img_folder, mask_folder, output_folder):
    # 確保輸出資料夾存在
    os.makedirs(output_folder, exist_ok=True)

    # 遍歷影像資料夾中的所有檔案
    for img_file in os.listdir(img_folder):
        img_path = os.path.join(img_folder, img_file)
        mask_path = os.path.join(mask_folder, img_file)
        output_path = os.path.join(output_folder, img_file)

        # 確保對應的標記影像存在
        if os.path.exists(mask_path):
            overlay_images(img_path, mask_path, output_path)

# 使用範例
img_folder = r"D:\image\image_r\r_img"  # 原始影像資料夾路徑
mask_folder = r"D:\image\image_r\r_mask"  # 標記影像資料夾路徑
output_folder = r"D:\image\image_r\output"  # 輸出影像資料夾路徑
new_color = (255, 0, 0, 255) 
process_images_in_folder(img_folder, mask_folder, output_folder)
