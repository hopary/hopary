// 在现有代码前添加安全过滤
async function loadArticles() {
    const rawData = await fetch('articles.json');
    const articles = await rawData.json();
    
    // 过滤无效数据
    return articles.filter(article => 
        article.id && 
        article.title &&
        article.date
    );
}

// 渲染文章时添加内容消毒
function renderArticle(content) {
    return content
        .replace(/</g, '&lt;')  // 防止XSS
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
}

// 页面路由配置
const routes = {
    '#home': renderHome,
    '#articles': renderArticles,
    '#about': renderAbout,
    '#article': renderArticle,
    '#more': renderMore
};

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
    await loadArticles();
    createStars();
    handleRouting();
    window.addEventListener('hashchange', handleRouting);
    disableDevTools();
});

// 加载文章数据（恢复手动ID）
async function loadArticles() {
    try {
        const response = await fetch('articles.json');
        articles = await response.json();
        
        // 检查ID唯一性
        const idSet = new Set();
        articles.forEach(article => {
            if (!article.id) throw new Error(`文章"${article.title}"缺少ID`);
            if (idSet.has(article.id)) throw new Error(`重复ID: ${article.id}`);
            idSet.add(article.id);
        });
    } catch (error) {
        console.error('文章加载失败:', error);
        alert('文章数据错误: ' + error.message);
    }
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
    
    document.getElementById('content').innerHTML = `
        <article>
            <h2>${article.title}</h2>
            <p class="article-date">${article.date}</p>
            <div class="article-content">${article.content}</div>
        </article>
    `;
}

// 渲染关于页面
function renderAbout() {
    document.getElementById('content').innerHTML = `
        <div class="about-content">
            <h2>关于Alog</h2>
            <p>Alog是一个专注于分享知识和见解的个人博客。</p>
<p>版权声明</p>
 
<p>本站alog.top（以下简称“本站”）所有文章，包括但不限于原创内容、编辑整理内容，其版权均归本站所有。未经本站许可，任何单位及个人不得擅自复制、传播、篡改、演绎、转载、摘编或以其他任何方式使用这些文章。</p>
<p> 
对于确需引用本站文章内容的情形，应在显著位置注明文章出处为本站及原始作者，并确保引用内容准确完整，不得歪曲、断章取义。引用目的仅限于个人学习、研究或欣赏，以及符合法律法规规定的适当引用情形。</p>
<p> 
若有第三方违反本版权声明，擅自使用本站文章，本站将依法追究其法律责任，要求其承担停止侵权、消除影响、赔礼道歉、赔偿损失等法律后果。</p>
<p> 
本站保留对本版权声明的最终解释权，并有权根据法律法规的变化以及实际情况对声明内容进行修改和调整 。修改后的声明将在本站公布，自公布之日起生效。</p>
         
            <p>联系方式：qingfeng@alog.top</p>
         
        </div>
    `;
}

// 渲染更多页面
function renderMore() {
    document.getElementById('content').innerHTML = `
        <div class="more-content">
            <p>待开发...</p>
        
         
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

// 禁用开发者工具和复制
function disableDevTools() {
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') || 
            (e.ctrlKey && e.key === 'u') || 
            (e.ctrlKey && e.key === 'c')) {
            e.preventDefault();
        }
    });
}

