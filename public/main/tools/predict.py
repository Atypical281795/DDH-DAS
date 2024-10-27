import torch
import torchvision.transforms as T
from PIL import Image
import numpy as np
import sys
import os

# 添加包含train.ipynb的目录到Python路径
notebook_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(notebook_dir)

# 使用nbimporter导入Jupyter Notebook
import nbimporter
from train import UNet

def load_image(image_path, target_size=(512, 512)):
    image = Image.open(image_path)
    transform = T.Compose([
        T.Resize(target_size),
        T.ToTensor(),
    ])
    return transform(image).unsqueeze(0)  # 添加batch维度

def predict(model, image_tensor):
    model.eval()
    with torch.no_grad():
        output = model(image_tensor)
        prediction = torch.sigmoid(output) > 0.5
    return prediction.squeeze().cpu().numpy()

def visualize_prediction(image, prediction):
    # 将张量转换为PIL图像
    image_pil = T.ToPILImage()(image.squeeze())
    
    # 创建一个新的图像，包含原图和预测结果
    result = Image.new('RGB', (image_pil.width * 2, image_pil.height))
    result.paste(image_pil, (0, 0))
    
    # 将预测结果转换为PIL图像
    prediction_pil = Image.fromarray((prediction * 255).astype(np.uint8))
    prediction_pil = prediction_pil.convert('RGB')
    
    result.paste(prediction_pil, (image_pil.width, 0))
    
    # 保存结果
    result.save('prediction_result.png')
    print("预测结果已保存为 'prediction_result.png'")

def main():
    # 加载模型
    model = UNet()
    model.load_state_dict(torch.load('unet_left_model.pth', map_location=torch.device('cpu'), weights_only=True))
    
    # 加载并预处理图像
    image_path = r"C:\Users\Ryan\Desktop\標記測試\unet\dataset\left\resize_image\1.png"  # 替换为您的测试图像路径
    image_tensor = load_image(image_path)
    
    # 进行预测
    prediction = predict(model, image_tensor)
    
    # 可视化结果
    visualize_prediction(image_tensor, prediction)

if __name__ == '__main__':
    main()