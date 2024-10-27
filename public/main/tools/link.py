import cv2
import numpy as np
import math
import os  # 新增匯入 os 模組

# 指定資料夾路徑
folder_path = r"D:\image\image_r\output"  # 更新為您的資料夾路徑
output_folder = os.path.join(folder_path, "final")  # 新增：指定輸出資料夾

# 確保輸出資料夾存在
if not os.path.exists(output_folder):
    os.makedirs(output_folder)  # 新增：創建輸出資料夾

# 遍歷資料夾中的所有影像檔案
for filename in os.listdir(folder_path):
    if filename.endswith(('.png', '.jpg', '.jpeg')):  # 檢查檔案類型
        image_path = os.path.join(folder_path, filename)  # 獲取完整檔案路徑
        image = cv2.imread(image_path)  # 讀取影像

        # 轉換顏色空間到 HSV
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

        # 新增計算角度的函數
        def getAngle(pts):
            pt1, pt2, pt3 = pts
            m1 = gradient(pt1, pt2)
            m2 = gradient(pt1, pt3)
            angR = math.atan((m2 - m1) / (1 + (m2 * m1)))
            angD = round(math.degrees(angR))
            if angD < 0:
                angD = 180 + angD
            return angD

        def gradient(pt1, pt2):
            return (pt2[1] - pt1[1]) / (pt2[0] - pt1[0])

        # 定義紅色的範圍
        lower_red1 = np.array([0, 100, 100])
        upper_red1 = np.array([10, 255, 255])
        lower_red2 = np.array([160, 100, 100])
        upper_red2 = np.array([180, 255, 255])

        # 創建紅色的遮罩
        mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
        mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
        mask = mask1 | mask2

        # 找到紅點的輪廓
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # 獲取紅點的中心位置
        centers = []
        for contour in contours:
            if cv2.contourArea(contour) > 10:  # 過濾小輪廓
                M = cv2.moments(contour)
                if M['m00'] != 0:
                    cX = int(M['m10'] / M['m00'])
                    cY = int(M['m01'] / M['m00'])
                    centers.append((cX, cY))

        # 畫特定的對角線並計算角度
        if len(centers) >= 6:  # 確保有足夠的點
            cv2.line(image, centers[0], centers[4], (255, 0, 0), 2)  # 連接一與四
            cv2.line(image, centers[1], centers[5], (255, 0, 0), 2)  # 連接二與五
            cv2.line(image, centers[2], centers[3], (255, 0, 0), 2)  # 連接三與六

            # 計算基準線（三與六的連線）
            base_line = [centers[2], centers[3]]
            
            # 計算 alpha 角
            alpha = getAngle([centers[0], centers[4], base_line[0]])
            alpha = 180 - alpha  # 將角度轉換為銳角
            
            # 計算 beta 角
            beta = getAngle([centers[1], centers[5], base_line[0]])
            beta = 180 - beta  # 將角度轉換為銳角

            # 根據角度設定顏色
            if alpha > 60 and beta < 55:
                color = (0, 255, 0)  # 綠色
                status = "正常"
            elif 50 <= alpha <= 59 and 55 <= beta < 57:
                color = (0, 255, 255)  # 黃色
                status = "髖臼不成熟，須持續追蹤"
            elif 43 <= alpha <= 49 and beta < 77:
                color = (0, 165, 255)  # 橙色
                status = "發育不良，需立即治療"
            elif 43 <= alpha <= 49 and beta > 77:
                color = (0, 0, 255)  # 紅色
                status = "關節鬆脫"
            elif alpha < 43 and beta > 77:
                color = (0, 0, 255)  # 紅色
                status = "半脫位 or 脫臼"
            else:
                color = (255, 0, 0)  # 預設顏色
                status = "例外狀況"

            # 在圖像上顯示角度，位置調整為靠近連線的中間
            mid_alpha = ((centers[0][0] + centers[4][0]) // 2, (centers[0][1] + centers[4][1]) // 2)
            mid_beta = ((centers[1][0] + centers[5][0]) // 2, (centers[1][1] + centers[5][1]) // 2)

            cv2.putText(image, f'Alpha: {alpha}', (mid_alpha[0] + 10, mid_alpha[1] - 10), cv2.FONT_HERSHEY_COMPLEX, 0.5, color, 1)
            cv2.putText(image, f'Beta: {beta}', (mid_beta[0] + 10, mid_beta[1] - 10), cv2.FONT_HERSHEY_COMPLEX, 0.5, color, 1)

            # 儲存 alpha 和 beta 角度到 txt 文件
            with open(os.path.join(output_folder, f"{os.path.splitext(filename)[0]}.txt"), 'w') as f:
                f.write(f'Alpha: {alpha}\n')
                f.write(f'Beta: {beta}\n')
                f.write(f'Status: {status}\n')  # 新增：寫入狀態

        # 顯示結果
        # cv2.imshow('Image with Diagonal Lines', image)

        # 儲存影像
        output_path = os.path.join(output_folder, filename)  # 更新為原檔名
        cv2.imwrite(output_path, image)  # 儲存影像

        cv2.waitKey(0)
        cv2.destroyAllWindows()
