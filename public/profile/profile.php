<?php
session_start();
include '../../db_connection.php';

// 检查用户是否已登录
if (!isset($_SESSION['user_id'])) {
    header("Location: ../login/login.php");
    exit();
}

// 获取用户信息
$user_id = $_SESSION['user_id'];
$sql = "SELECT * FROM users WHERE id = $user_id";
$result = $conn->query($sql);
$user = $result->fetch_assoc();

// 处理表单提交
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $conn->real_escape_string($_POST['name']);
    $phone = $conn->real_escape_string($_POST['phone']);
    $email = $conn->real_escape_string($_POST['email']);
    $location = $conn->real_escape_string($_POST['location']);
    $experience = $conn->real_escape_string($_POST['experience']);

    $sql = "UPDATE users SET name='$name', phone='$phone', email='$email', location='$location', experience='$experience' WHERE id=$user_id";
    if ($conn->query($sql) === TRUE) {
        $message = "个人资料更新成功";
    } else {
        $error = "错误: " . $conn->error;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <!-- 头部内容保持不变 -->
</head>
<body>
    <div class="profile-container">
        <div class="left-block">
            <div class="profile-icon-container">
                <input type="file" id="profile-upload" accept="image/*" style="display:none">
                <label for="profile-upload" class="profile-icon">
                    <img src="<?php echo htmlspecialchars($user['avatar_path']); ?>" alt="Profile" id="profile-image">
                </label>
            </div>
            <h2 id="profile-name"><?php echo htmlspecialchars($user['name']); ?></h2>
            <p class="UserID:<?php echo htmlspecialchars($user['id']); ?>">Identity</p>
        </div>
        <div class="right-block">
            <form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
                <div class="input-group">
                    <label for="experience">Experience</label>
                    <textarea id="experience" name="experience" rows="4"><?php echo htmlspecialchars($user['experience']); ?></textarea>
                </div>
                <div class="input-group">
                    <label for="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" value="<?php echo htmlspecialchars($user['phone']); ?>">
                </div>
                <div class="input-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($user['email']); ?>">
                </div>
                <div class="input-group">
                    <label for="location">Location</label>
                    <input type="text" id="location" name="location" value="<?php echo htmlspecialchars($user['location']); ?>">
                </div>
                <div class="button-group">
                    <button type="button" id="back-to-menu">Back to Menu</button>
                    <button type="submit" id="save-profile">Save</button>
                </div>
            </form>
        </div>
    </div>
    <script src="profile.js"></script>
</body>
</html>