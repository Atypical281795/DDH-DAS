<?php
    include ('dbconnection.php');
    if (isset($_POST['submit'])) {
        $file_name = $_FILES['image']['name'];
        $tempname = $_FILES["image"]['tmp_name'];
        $folder = "uploads/".$file_name;

        $query = mysqli_query($con, "INSERT INTO images (file) VALUES ('$file_name')");
        if (move_uploaded_file($tempname, $folder)) {
            echo "<h3> 圖片上傳成功! </h3>";
        } else {
            echo "<h3> 圖片上傳失敗! </h3>";
        }
    }
?>
<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <form method="post" enctype="multipart/form-data">
            <input type="file" name="image">
            <br>
            <button type="submit" name="submit">上傳</button>
        </form>
        <div>
            <?php
                $res = mysqli_query($con, "SELECT * FROM images");
                while ($row = mysqli_fetch_assoc($res)) {
            ?>
            <img src='uploads/<?php echo $row['file']?>" />
            <?php }?>
        </div>
    </body>
</html>