// 加载公共模块
function loadTemplate() {
    // 加载头部
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('site-header').innerHTML = data;
        });

    // 加载页脚
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('site-footer').innerHTML = data;
        });

    // 禁用开发者工具
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.onkeydown = function(e) {
        if (e.keyCode === 123) return false;
    };
}

// 页面加载完成后执行
window.onload = loadTemplate;

