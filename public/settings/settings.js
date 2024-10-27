function showSection(sectionId) {
    document.querySelectorAll('.form-container').forEach(container => {
        container.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[onclick="showSection('${sectionId}')"]`).classList.add('active');
}


function backToMenu() {
    window.location.href = "http://localhost/DDHDAS/public/main/main.php";
}
