<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include ('dbconnection.php');

$con = mysqli_connect("localhost", "root", "", "ddhdas");

if ($con == false) {
    die("ERROR: Could not connect. " . mysqli_connect_error());
} else {
    // echo "Database connected successfully."; // 調試信息
}

if (isset($_FILES['image'])) {
    $file_name = $_FILES['image']['name'];
    $tempname = $_FILES["image"]['tmp_name'];
    $folder = "uploads/".$file_name;

    // 儲存圖片到資料庫
    $user = 'username'; // 這裡可以根據實際情況獲取使用者名稱
    $query = mysqli_query($con, "INSERT INTO original_img (user, original_img) VALUES ('$user', '$file_name')");

    if (!$query) {
        // 如果資料庫插入失敗，返回錯誤信息
        header('HTTP/1.1 500 Internal Server Error');
        echo "ERROR: " . mysqli_error($con);
        exit; // 結束腳本執行
    }

    if (move_uploaded_file($tempname, $folder)) {
        // 返回圖片的 URL
        header('Content-Type: application/json');
        // 新增：獲取所有上傳的圖片名稱
        $result = mysqli_query($con, "SELECT original_img FROM original_img");
        $images = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $images[] = $row['original_img'];
        }
        echo json_encode(['success' => true, 'image_name' => $file_name, 'image_path' => $folder, 'images' => $images]); // 返回所有圖片名稱
        exit; // 結束腳本執行
    } else {
        // 如果圖片上傳失敗，返回錯誤信息
        header('HTTP/1.1 500 Internal Server Error');
        echo "Image upload failed!";
    }
} else {
    // 如果沒有上傳圖片，返回錯誤信息
    header('HTTP/1.1 400 Bad Request');
    echo "No image uploaded!";
}
?>
