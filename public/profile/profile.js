document.addEventListener('DOMContentLoaded', function() {
    const profileUpload = document.getElementById('profile-upload');
    const profileImage = document.getElementById('profile-image');

    profileUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    const profileNameElement = document.getElementById('profile-name');
    
    // 從 localStorage 獲取用户名並設置
    let userName = localStorage.getItem('userName') || 'Your Name';
    profileNameElement.textContent = userName;

    // 允許用户编辑名字，並在编辑后更新 localStorage
    profileNameElement.contentEditable = true;
    profileNameElement.addEventListener('blur', function() {
        localStorage.setItem('userName', this.textContent);
    });

    const backToMenuBtn = document.getElementById('back-to-menu');
    backToMenuBtn.addEventListener('click', function() {
        // 這裡替換成您想要跳轉的菜單頁面URL
        window.location.href = "http://localhost/DDHDAS/public/main/main.php";
    });

    const saveProfileBtn = document.getElementById('save-profile');
    saveProfileBtn.addEventListener('click', function() {
        // 獲取所有輸入的值
        const userName = document.getElementById('profile-name').textContent;
        const experience = document.getElementById('experience').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const location = document.getElementById('location').value;

        // 創建一個對象來存儲這些值
        const profileData = {
            userName,
            experience,
            phone,
            email,
            location,
            // 如果需要，也可以添加頭像的base64字符串
            avatar: profileImage.src
        };

        // 將數據保存到localStorage
        localStorage.setItem('profileData', JSON.stringify(profileData));

        alert('Profile saved successfully!');
    });
    
    // 頁面加載時，嘗試恢復保存的數據
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
        const profileData = JSON.parse(savedData);
        document.getElementById('profile-name').textContent = profileData.userName || 'Your Name';
        document.getElementById('experience').value = profileData.experience || '';
        document.getElementById('phone').value = profileData.phone || '';
        document.getElementById('email').value = profileData.email || '';
        document.getElementById('location').value = profileData.location || '';
        if (profileData.avatar) {
            profileImage.src = profileData.avatar;
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const userId = 'some-unique-user-id'; // 获取或生成用户ID
    localStorage.setItem('userId', userId); // 保存用户ID到localStorage
});

