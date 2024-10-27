document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('start-button').style.display = 'none'; // 隱藏 Start 按鈕

    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    let rotateDegree = 0; // 用來記錄旋轉角度

    loadImageList();
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('sidebar-open');
        mainContent.classList.toggle('sidebar-open');

        // 更新旋轉角度和樣式
        rotateDegree += 90;
        if (rotateDegree >= 360) rotateDegree = 0;

        // 根據角度應用旋轉樣式
        sidebarToggle.classList.remove('rotate-0', 'rotate-90', 'rotate-180', 'rotate-270', 'rotate-360', 'rotate-450', 'rotate-900');
        if (rotateDegree === 90) sidebarToggle.classList.add('rotate-90');
        else if (rotateDegree === 180) sidebarToggle.classList.add('rotate-0');
        else if (rotateDegree === 270) sidebarToggle.classList.add('rotate-90');
        else sidebarToggle.classList.add('rotate-0');
    });
    
    function loadImageList() {
        fetch('upload_image.php') // 假設您有一個 PHP 文件來獲取圖片列表
            .then(response => response.json())
            .then(data => {
                const imageList = document.getElementById('image-list');
                data.images.forEach(imageName => {
                    if (imageName) { // 確保 imageName 是有效的
                        const li = document.createElement('li');
                        li.textContent = imageName;
                        li.dataset.imagePath = `http://localhost/DDHDAS/public/main/uploads/${imageName}`; // 設置圖片路徑
                        imageList.appendChild(li);
                    } else {
                        console.warn('Image name is undefined'); // 輸出警告信息
                    }
                });
            })
            .catch(error => {
                console.error('Error loading images:', error);
            });
    }
    const userNameElement = document.getElementById('user-name');
    let userName = localStorage.getItem('userName') || 'uourName';
    userNameElement.textContent = userName;
    userNameElement.contentEditable = true;
    userNameElement.addEventListener('blur', function() {
        localStorage.setItem('userName', this.textContent);
    });

    document.getElementById('user-menu').addEventListener('click', function() {
        var dropdown = document.getElementById('user-dropdown');
        var menuArrow = document.getElementById('menu-arrow');
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
            menuArrow.style.transform = 'rotate(0deg)';
        } 
        else {
            dropdown.style.display = 'block';
            menuArrow.style.transform = 'rotate(180deg)';
        }
    });

    document.getElementById('search-input').addEventListener('input', function() {
        var filter = this.value.toLowerCase();
        var list = document.getElementById('image-list');
        var items = list.getElementsByTagName('li');
        for (var i = 0; i < items.length; i++) {
            var text = items[i].textContent.toLowerCase();
            if (text.indexOf(filter) > -1) {
                items[i].style.display = '';
            } 
            else {
                items[i].style.display = 'none';
            }
        }
    });

    ['export-excel', 'export-image'].forEach(function(id) {
        document.getElementById(id).addEventListener('click', function() {
            alert('Button clicked: ' + this.textContent.trim());
        });
    });

    document.querySelectorAll('#image-list li').forEach(item => {
        item.addEventListener('click', function() {
            var imageName = this.textContent;
            updateOriginalImage(imageName);
        });
    });

    function updateOriginalImage(imageName) {
        var imagePath = `http://localhost/DDHDAS/public/main/uploads/${imageName}`;
        var img = document.getElementById('loaded-image');
        var container = img.parentElement;

        img.onload = function() {
            resizeImage(img, container);
        }

        img.src = imagePath;
        img.style.display = 'block';
        document.getElementById('load-image-button').style.display = 'none';
        document.getElementById('start-button').style.display = 'block';
    }

    function resizeImage(img, container) {
        var containerWidth = container.clientWidth;
        var containerHeight = container.clientHeight;
        var imgAspectRatio = img.naturalWidth / img.naturalHeight;
        var containerAspectRatio = containerWidth / containerHeight;

        if (imgAspectRatio > containerAspectRatio) {
            // 圖片寬，以寬度為基準
            img.style.width = '100%';
            img.style.height = 'auto';
        } 
        else {
            // 图片更高，以高度为基準
            img.style.width = 'auto';
            img.style.height = '100%';
        }
    }

    var selectedFile = null;

    function handleLoadImage() {
        document.getElementById('image-input').click();
    }

    document.getElementById('load-image-button').addEventListener('click', function() {
        document.getElementById('image-input').click(); // 觸發文件選擇器
    });

    document.getElementById('image-input').addEventListener('change', function(event) {
        var files = event.target.files; // 獲取選擇的文件
        if (files.length > 0) {
            var file = files[0]; // 只處理第一個文件
            var formData = new FormData();
            formData.append('image', file);

            // 上傳圖片到 original_img
            fetch('upload_image.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // 更新圖片列表
                    var li = document.createElement('li');
                    li.textContent = data.image_name;
                    document.getElementById('image-list').appendChild(li);
                    // 顯示上傳的圖片
                    updateOriginalImage(data.image_path); // 確保這裡的路徑是正確的
                } else {
                    alert('上傳失敗：' + data.error);
                }
            })
            .catch(error => {
                console.error('Error during upload:', error);
                alert('上傳圖片時出現錯誤：' + error.message);
            });
        }
    });

    // 處理圖列表點擊
    document.getElementById('image-list').addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            var imagePath = event.target.dataset.imagePath; // 获取数据属性中的图像路径
            // var imageName = event.target.textContent; // 獲取點擊的影像名稱
            // var imagePath = `C:\\wamp64\\www\\DDHDAS\\public\\main\\uploads\\${imageName}`; // 根據影像名稱生成路徑
            updateOriginalImage(imagePath); // 确保调用 updateOriginalImage 函数
        }
    });

    // 更新原始图像
    function updateOriginalImage(imagePath) {
        var img = document.getElementById('loaded-image');
        img.src = imagePath;
        img.style.display = 'block';
        document.getElementById('load-image-button').style.display = 'none';
        document.getElementById('start-button').style.display = 'block';
    }

    document.getElementById('start-button').addEventListener('click', function() {
        showConfirmationDialog();
    });

    //顯示是否需要增強影像
    function showConfirmationDialog() {
        var dialog = document.createElement('div');
        dialog.id = "parent";
        dialog.innerHTML = `
            <div id="confirmationDialog" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                <div style="background: white; padding: 20px; border-radius: 5px; text-align: center;">
                    <h2>Whether to enhance the image?</h2>
                    <button id="enhanceYes" style="margin-right: 10px; background: linear-gradient(to left, #94b9ff, #38b6ff); border-radius: 15px;">YES</button>
                    <button id="enhanceNo" style="border-radius: 15px;">NO</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);

        document.getElementById('enhanceYes').addEventListener('click', function() {
            showLoadingScreen();
            setTimeout(function() {
                showEnhencedImage();
                updateLaterCheck();
                console.log("mf");
                document.body.removeChild(dialog);
            }, 3000);
        });

        function showEnhencedImage() {
            var originalImage = document.querySelector('.image-box:first-child .image-content img');
            var imageName = originalImage.src.split('/').pop(); // Get the original image name
            var enhancedImageName = imageName.split('.')[0] + '_enhance.png'; // Create the enhanced image name
            originalImage.src = `/DDHDAS/public/main/img/enhance/${enhancedImageName}`;
        }

        document.getElementById('enhanceNo').addEventListener('click', function() {
            document.body.removeChild(dialog);
            showLoadingIcon();
            setTimeout(function() {
                showResultImage();
            }, 3000);
        });
    }

    function showLoadingScreen() {
        var dialog = document.getElementById('confirmationDialog');
        dialog.innerHTML = `
            <div id="loadingfuck" style="background: white; padding: 20px; border-radius: 5px; text-align: center;">
                <div class="loading-icon" style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                <p>Loading...</p>
            </div>
        `;
    }

    function showLoadingIcon() {
        var laterImageContent = document.querySelector('.image-box:nth-child(2) .image-content');
        laterImageContent.innerHTML = '<div class="loading-icon" style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>';
    }

    function showReturnImage() {
        var originalImage = document.querySelector('.image-box:first-child .image-content img');
        var imageName = originalImage.src.split('/').pop().split('_')[0] + '.png'; // Get the original image name
        originalImage.src = `/DDHDAS/public/main/uploads/${imageName}`;
    }

    function updateLaterCheck() {
        // Update the Later Image (右)
        var laterImageContent = document.querySelector('.image-box:nth-child(2) .image-content');
        laterImageContent.innerHTML = `
            <div id="laterCheckContent" style="background: white; padding: 20px; width: 280px; border-radius: 5px; text-align: center;">
                <h2>Whether to use enhanced image to produce results?</h2>
                <button id="returnButton" style="margin-right: 10px; background: linear-gradient(to left, #94b9ff, #38b6ff); border-radius: 15px;">Return</button>
                <button id="continueButton" style="border-radius: 15px;">Continue</button>
            </div>
        `;

        // Add event listeners for the new buttons
        document.getElementById('returnButton').addEventListener('click', function() {
            showConfirmationDialog();
            showReturnImage();
        });

        document.getElementById('continueButton').addEventListener('click', function() {
            showLoadingIcon();
            setTimeout(function() {
                showResultImage();
            }, 3000);
        });
    }

    function showResultImage() {
        // Get the current displayed image path
        var originalImage = document.querySelector('.image-box:first-child .image-content img');
        var originalSrc = originalImage.src;
        
        // Extract image name
        var filename = originalSrc.split('/').pop();
        var filenameWithoutExtension = filename.split('.')[0];
        
        // Construct the path for the annotated image
        var outputImagePath = `/DDHDAS/public/main/img/output/${filenameWithoutExtension}_output.png`;
        
        // Update the second box with the annotated image
        var laterImageContent = document.querySelector('.image-box:nth-child(2) .image-content');
        laterImageContent.innerHTML = `
            <img src="${outputImagePath}" style="max-width: 100%; max-height: 100%;" alt="Annotated Image">
        `;
    
        var img = laterImageContent.querySelector('img');
        img.onload = function() {
            resizeImage(img, laterImageContent);
        }
    
        // Construct the path for the symptom description text file
        var textFilePath = `/DDHDAS/public/main/img/output/${filenameWithoutExtension}_output.txt`;
    
        // Load and update symptom description
        fetch(textFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Text file not found');
                }
                return response.arrayBuffer(); // 先獲取 ArrayBuffer
            })
            .then(buffer => {
                const decoder = new TextDecoder('utf-8'); // 使用 UTF-8 編碼器
                const text = decoder.decode(buffer); // 解碼
                var textArea = document.querySelector('textarea[placeholder="Description of symptoms"]');
                textArea.value = text;
            })
            .catch(error => {
                console.error('Error loading symptom description:', error);
                var textArea = document.querySelector('textarea[placeholder="Description of symptoms"]');
                textArea.value = 'Failed to load symptom description.';
            });
    }

    function loadSymptomDescription() {
        return fetch("C:\\wamp64\\www\\DDHDAS\\public\\main\\img\\output\\left\\1_output.txt")
            .then(response => response.text())
            .catch(error => {
                console.error('Error loading symptoms:', error);
                return ''; // 返回字符串以避免 undefined
            });
    }

    // Add CSS animation
    var style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);


    // Rest of the existing code...

    // 添加顯示登出確認對話框的函數
    function showLogoutConfirmationDialog() {
        var dialog = document.createElement('div');
        dialog.id = "logoutConfirmationDialog";
        dialog.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
                <div style="background: white; padding: 20px; border-radius: 5px; text-align: center;">
                    <h2>Do you want to logout?</h2>
                    <button id="logoutYes" style="margin-right: 10px;">YES</button>
                    <button id="logoutNo">NO</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);

        document.getElementById('logoutYes').addEventListener('click', function() {
            // 執行登出腳本
            fetch('http://127.0.0.1:5000/logout', {
                method: 'POST',
            })
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                    window.close();
                } 
                else {
                    response.json().then(data => {
                        if (data.success) {
                            alert('Logout successful.');
                        } 
                        else {
                            alert('Logout failed.');
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
            document.body.removeChild(dialog);
        });

        document.getElementById('logoutNo').addEventListener('click', function() {
            document.body.removeChild(dialog);
        });
    }

    // 添加 Exit 按鈕點擊事件處理器
    document.getElementById('exit').addEventListener('click', function() {
        showLogoutConfirmationDialog();
    });


    function backToMenu() {
        console.log("Retry button clicked, refreshing the page...");
        location.reload();
    }
    document.getElementById('logout-link').addEventListener('click', function(event) {
        event.preventDefault();
        fetch('http://127.0.0.1:5000/logout', {
            method: 'POST',
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
                window.close();
            } 
            else {
                response.json().then(data => {
                    if (data.success) {
                        alert('Logout successful.');
                        window.location.href = 'login.html'; // 重定向到登錄頁面
                        window.close(); // 嘗試關閉當前窗口
                    } 
                    else {
                        alert('Logout failed.');
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        document.body.removeChild(dialog);
    });

    document.getElementById('export-image').addEventListener('click', function() {
        var laterImage = document.querySelector('.image-box:nth-child(2) .image-content img');

        if (laterImage) {
            // 獲取圖片的 src
            var imageSrc = laterImage.src;

            // 檢查圖片來源是否是本地文件
            if (imageSrc.startsWith('file://')) {
                alert('本地文件無法直接讀取，請使用網頁上的文件。');
            } 
            else {
                // 將圖片轉換為 Blob
                fetch(imageSrc)
                    .then(response => response.blob())
                    .then(blob => {
                        // 使用 FileSaver.js 或者創建一個鏈接來觸發下載
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'annotated_image.png'; // 設定下載的檔名
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url); // 釋放 URL 物件
                    })
                    .catch(error => {
                        console.error('Error:', error); // 調日誌
                    });
            }
        } 
        else {
            alert('No image found to export.');
        }
    });
    document.getElementById('export-excel').addEventListener('click', function() {
        console.log('Export to Excel button clicked'); // 確認按鈕被點擊
        // 獲取描述和評論內容
        var description = document.querySelector('textarea[placeholder="Description of symptoms"]').value;
        var comment = document.querySelector('textarea[placeholder="Comment"]').value; // 假設有一個 ID 為 comment-input 的輸入框
    
        // 創建 Excel 文件
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet([{ Description: description, Comment: comment }]);
        XLSX.utils.book_append_sheet(wb, ws, "Symptoms");
    
        // 生成 Excel 文件並觸發下載
        XLSX.writeFile(wb, 'symptoms_data.xlsx'); // 這裡會彈出儲存對話框
    });
    document.getElementById('retry').addEventListener('click', function() {
        // 彈出確認對話框
        if (confirm("您確定要重新開始嗎？")) {
            location.reload(); // 如果使用者點擊確定」，則刷新頁面
        }
    });

    document.getElementById('select-folder').addEventListener('click', function() {
        document.getElementById('image-input').click(); // 點擊文件選擇器
    });

    // 新增函數以觸發 env.py 和 AHE.py
    function triggerEnvAndProcessImage() {
        var img = document.getElementById('loaded-image');
        var imagePath = img.src; // 獲取當前顯示的影像路徑

        // 使用 fetch 觸發 env.py
        fetch("http://127.0.0.1:5000/activate_env", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 環境啟動成功後，執行 AHE.py
                runAHE(imagePath);
            } else {
                alert('Failed to activate environment: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // 增函數以執行 AHE.py
    function runAHE(imagePath) {
        fetch("http://127.0.0.1:5000/run_ahe", {
            method: 'POST',
            body: JSON.stringify({ imagePath: imagePath }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Image enhanced successfully! Output path: ' + data.outputPath);
            } else {
                alert('Failed to enhance image: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function exportImage() {
        const image = document.getElementById('loaded-image');
        if (image.src) {
            const link = document.createElement('a');
            link.href = image.src;
            link.download = 'output_image.png'; // 設定下載的檔名
            link.click();
        } else {
            alert('No image to export.');
        }
    }
});

