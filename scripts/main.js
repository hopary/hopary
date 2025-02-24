// 从外部文件加载文章数据
let articles = [];

// 页面路由配置
const routes = {
    '#home': renderHome,
    '#articles': renderArticles,
    '#about': renderAbout,
    '#article': renderArticle
};

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
    await loadArticles();
    createStars();
    handleRouting();
    window.addEventListener('hashchange', handleRouting);
});

// 加载文章数据
async function loadArticles() {
    try {
        const response = await fetch('articles.json');
        const text = await response.text();
        articles = JSON.parse(text);
        validateArticles();
    } catch (error) {
        handleLoadingError(error);
    }
}

function validateArticles() {
    const idSet = new Set();
    articles.forEach(article => {
        if (!article.id) throw new Error(`文章"${article.title}"缺少ID`);
        if (idSet.has(article.id)) throw new Error(`重复ID: ${article.id}`);
        idSet.add(article.id);
    });
}

function handleLoadingError(error) {
    console.error('文章加载失败:', error);
    alert('错误: ' + error.message);
}

// 路由处理
function handleRouting() {
    const [route, id] = window.location.hash.split('/');
    const handler = routes[route] || renderHome;
    handler(id);
}

// 渲染首页
function renderHome() {
    document.getElementById('content').innerHTML = `
        <div class="slogan">
            <h1>探索知识与灵感</h1>
            <p>在星辰之间寻找智慧的光芒</p>
        </div>
    `;
}

// 渲染文章列表
function renderArticles() {
    const sortedArticles = articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    const listItems = sortedArticles.map(article => `
        <li class="article-item">
            <div class="article-title">
                <a href="#article/${article.id}" class="article-link">${article.title}</a>
            </div>
            <div class="article-date">${article.date}</div>
        </li>
    `).join('');
    
    document.getElementById('content').innerHTML = `
        <h2 class="article-list-title">最新文章</h2>
        <ul class="article-list">${listItems}</ul>
    `;
}

// 渲染单篇文章
function renderArticle(id) {
    const article = articles.find(a => a.id == id);
    if (!article) return renderArticles();
    
    const safeContent = article.content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    
    document.getElementById('content').innerHTML = `
        <article>
            <h2>${article.title}</h2>
            <p class="article-date">${article.date}</p>
            <div class="article-content">${safeContent}</div>
        </article>
    `;
}

// 渲染关于页面
function renderAbout() {
    document.getElementById('content').innerHTML = `
        <div class="about-content">
            <h2>关于Alog</h2>
            <p>Alog是一个专注于分享知识和见解的个人博客。</p>
            <p>联系方式：qingfeng@alog.top</p>
            
        </div>
    `;
}

// 创建星星背景
function createStars() {
    const container = document.getElementById('bg-effects');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 1.5 + 's';
        container.appendChild(star);
    }
}