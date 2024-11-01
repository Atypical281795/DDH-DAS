<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Analysis Tool</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="main.css">
</head>
<body>
    <div id="header">
        <button id="sidebar-toggle"><i class="fas fa-bars"></i></button>
    </div>
    <div id="sidebar">
        <!-- Sidebar content -->
        <div class="container">
            <div class="list-title">
                <h3>List Of images</h3>
            </div>
        </div>
        <div id="search-container">
            <i id="search-icon" class="fas fa-search"></i>
            <input type="text" id="search-input" placeholder="Search">
        </div>
        <ul id="image-list">
            <!-- 這裡可以動態生成圖片列表 -->
        </ul>
        <button id="select-folder">Select folder</button>
        <div id="user-menu-block">
            <div id="user-menu">
                <i class="fas fa-user"></i>
                <span id="user-name">your name</span>
                <i class="fas fa-caret-down" id="menu-arrow"></i>
            </div>
            <ul id="user-dropdown">
                <a href="..\profile\profile.html"><i class="fas fa-user"></i>Profile</a>
                <a href="..\settings\settings.html"><i class="fas fa-cog"></i>Settings</a>
                <a href="#" id="logout-link"><i class="fas fa-sign-out-alt"></i>Logout</a>
            </ul>
        </div>
    </div>
    <div id="main-content">
        <div class="image-container">
            <div class="image-box">
                <div class="image-title"><h4>Ultrasound Image</h4></div>
                <div class="image-content">
                    <button id="load-image-button">Click to load image</button>
                    <input type="file" id="image-input" style="display:none;" accept="image/*">
                    <img id="loaded-image" style="display:none; max-width: 100%; max-height: 100%;" alt="Loaded Image">
                </div>
            </div>
            <div class="image-box">
                <div class="image-title"><h4>Annotated Image</h4></div>
                <div class="image-content">
                    <button id="start-button" style="display:none;" pyscript="run_ahe()">START</button>
                </div>
            </div>
        </div>
        <div class="bottom-container">
            <div class="text-area-container">
                <div class="text-area-wrapper">
                    <h3 class="text-title">Description of symptoms</h3>
                    <textarea placeholder="Description of symptoms"></textarea>
                </div>
                <div class="text-area-wrapper">
                    <h3 class="text-title">Comment</h3>
                    <textarea placeholder="Comment"></textarea>
                </div>
            </div>
            <div class="button-container">
                <div class="action-button-wrapper">
                    <div class="action-icon"><i class="fas fa-redo"></i></div>
                    <button class="action-button" onclick="backToMenu()" id="retry"><h5>Retry</h5></button>
                </div>
                <div class="action-button-wrapper">
                    <div class="action-icon"><i class="fas fa-file-excel"></i></div>
                    <button class="action-button" id="export-excel"><h5>Export to Excel</h5></button>
                </div>
                <div class="action-button-wrapper">
                    <div class="action-icon"><i class="fas fa-file-image"></i></div>
                    <button class="action-button" id="export-image" onclick="exportImage()"><h5>Export image</h5></button>
                </div>
                <div class="action-button-wrapper">
                    <div class="action-icon"><i class="fas fa-sign-out-alt"></i></div>
                    <button class="action-button" id="exit"><h5>Exit</h5></button>
                </div>
            </div>
        </div>
    </div>
    <script src="main.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js"></script>
</html>
