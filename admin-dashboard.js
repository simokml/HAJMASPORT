// التحقق من تسجيل الدخول
function checkAuth() {
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'admin-login.html';
        return false;
    }
    return true;
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    window.location.href = 'admin-login.html';
}

// الحصول على المقالات من التخزين المحلي
function getArticles() {
    const articles = localStorage.getItem('hajmasport_articles');
    return articles ? JSON.parse(articles) : [];
}

// حفظ المقالات في التخزين المحلي
function saveArticles(articles) {
    localStorage.setItem('hajmasport_articles', JSON.stringify(articles));
}

// إضافة مقال جديد
function addArticle(articleData) {
    const articles = getArticles();
    const newArticle = {
        id: Date.now(),
        title: articleData.title,
        category: articleData.category,
        content: articleData.content,
        image: articleData.image,
        author: articleData.author,
        date: new Date().toISOString(),
        excerpt: articleData.content.substring(0, 150) + '...'
    };
    
    articles.unshift(newArticle); // إضافة في البداية
    saveArticles(articles);
    
    return newArticle;
}

// حذف مقال
function deleteArticle(articleId) {
    const articles = getArticles();
    const filteredArticles = articles.filter(article => article.id !== articleId);
    saveArticles(filteredArticles);
}

// تحديث الإحصائيات
function updateStats() {
    const articles = getArticles();
    const today = new Date().toDateString();
    const todayArticles = articles.filter(article => 
        new Date(article.date).toDateString() === today
    );
    
    document.getElementById('total-articles').textContent = articles.length;
    document.getElementById('today-articles').textContent = todayArticles.length;
    
    if (articles.length > 0) {
        const lastArticle = articles[0];
        const lastDate = new Date(lastArticle.date).toLocaleDateString('ar-SA');
        document.getElementById('last-article').textContent = lastDate;
    }
}

// عرض المقالات
function displayArticles() {
    const articles = getArticles();
    const container = document.getElementById('articles-list');
    
    if (articles.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #b3b3b3; padding: 20px;">لا توجد مقالات منشورة</p>';
        return;
    }
    
    container.innerHTML = '';
    
    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'article-item';
        
        const articleDate = new Date(article.date).toLocaleDateString('ar-SA');
        
        articleElement.innerHTML = `
            <div class="article-info">
                <h4>${article.title}</h4>
                <p>📅 ${articleDate} | 🏷️ ${article.category} | ✍️ ${article.author}</p>
            </div>
            <div class="article-actions">
                <button class="btn btn-small btn-edit" onclick="editArticle(${article.id})">تعديل</button>
                <button class="btn btn-small btn-delete" onclick="deleteArticleConfirm(${article.id})">حذف</button>
            </div>
        `;
        
        container.appendChild(articleElement);
    });
}

// فتح نافذة إضافة مقال
function openAddArticleModal() {
    document.getElementById('add-article-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// إغلاق نافذة إضافة مقال
function closeAddArticleModal() {
    document.getElementById('add-article-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('article-form').reset();
}

// تأكيد حذف المقال
function deleteArticleConfirm(articleId) {
    if (confirm('هل أنت متأكد من حذف هذا المقال؟')) {
        deleteArticle(articleId);
        displayArticles();
        updateStats();
        alert('تم حذف المقال بنجاح!');
    }
}

// تعديل مقال (مبسط)
function editArticle(articleId) {
    const articles = getArticles();
    const article = articles.find(a => a.id === articleId);
    
    if (article) {
        // ملء النموذج بالبيانات الحالية
        document.getElementById('article-title').value = article.title;
        document.getElementById('article-category').value = article.category;
        document.getElementById('article-content').value = article.content;
        document.getElementById('article-image').value = article.image || '';
        document.getElementById('article-author').value = article.author;
        
        // حذف المقال القديم عند الحفظ
        document.getElementById('article-form').setAttribute('data-edit-id', articleId);
        
        openAddArticleModal();
    }
}

// تحديث الإحصائيات
function refreshStats() {
    updateStats();
    alert('تم تحديث الإحصائيات!');
}

// تصدير المقالات
function exportArticles() {
    const articles = getArticles();
    const dataStr = JSON.stringify(articles, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'hajmasport-articles-' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
}

// معالجة نموذج إضافة المقال
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من تسجيل الدخول
    if (!checkAuth()) return;
    
    // تحديث الإحصائيات وعرض المقالات
    updateStats();
    displayArticles();
    
    // معالجة نموذج إضافة المقال
    document.getElementById('article-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('article-title').value,
            category: document.getElementById('article-category').value,
            content: document.getElementById('article-content').value,
            image: document.getElementById('article-image').value,
            author: document.getElementById('article-author').value
        };
        
        // التحقق من التعديل
        const editId = this.getAttribute('data-edit-id');
        if (editId) {
            // حذف المقال القديم
            deleteArticle(parseInt(editId));
            this.removeAttribute('data-edit-id');
        }
        
        // إضافة المقال الجديد
        addArticle(formData);
        
        // إغلاق النافذة وتحديث العرض
        closeAddArticleModal();
        displayArticles();
        updateStats();
        
        alert('تم حفظ المقال بنجاح! ✅');
    });
    
    // إغلاق النافذة عند النقر خارجها
    document.getElementById('add-article-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeAddArticleModal();
        }
    });
});