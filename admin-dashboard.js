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

// الحصول على المقالات من جميع المصادر
async function getArticles() {
    try {
        return await getArticlesFromAllSources();
    } catch (error) {
        console.error('خطأ في جلب المقالات:', error);
        // العودة للتخزين المحلي في حالة الخطأ
        const articles = localStorage.getItem('hajmasport_articles');
        return articles ? JSON.parse(articles) : [];
    }
}

// حفظ المقالات في التخزين المحلي والسحابة
async function saveArticles(articles) {
    // حفظ محلي (للسرعة)
    localStorage.setItem('hajmasport_articles', JSON.stringify(articles));
    console.log('تم حفظ', articles.length, 'مقال في التخزين المحلي');
    
    // حفظ في السحابة (للمشاركة بين المتصفحات)
    try {
        await saveArticlesToCloud(articles);
        console.log('تم حفظ المقالات في السحابة أيضاً');
    } catch (error) {
        console.error('خطأ في حفظ المقالات في السحابة:', error);
    }
}

// إضافة مقال جديد
async function addArticle(articleData) {
    const articles = await getArticles();
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

    // إشارة للصفحة الرئيسية لتحديث الأخبار
    localStorage.setItem('news_updated', Date.now().toString());

    return newArticle;
}

// حذف مقال
async function deleteArticle(articleId) {
    const articles = await getArticles();
    const filteredArticles = articles.filter(article => article.id !== articleId);
    saveArticles(filteredArticles);
}

// تحديث الإحصائيات
async function updateStats() {
    const articles = await getArticles();
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
async function displayArticles() {
    const articles = await getArticles();
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
                <button class="btn btn-small btn-share" onclick="shareArticle(${article.id})" style="background: #28a745;">مشاركة</button>
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
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'hajmasport-articles-' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
}

// معالجة نموذج إضافة المقال
document.addEventListener('DOMContentLoaded', async function () {
    // التحقق من تسجيل الدخول
    if (!checkAuth()) return;

    // تحديث الإحصائيات وعرض المقالات
    await updateStats();
    await displayArticles();

    // معالجة نموذج إضافة المقال
    document.getElementById('article-form').addEventListener('submit', async function (e) {
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
        await addArticle(formData);

        // إغلاق النافذة وتحديث العرض
        closeAddArticleModal();
        await displayArticles();
        await updateStats();

        alert('تم نشر المقال بنجاح! ✅\nالمقال متاح الآن للزوار في قسم الأخبار');
    });

    // إغلاق النافذة عند النقر خارجها
    document.getElementById('add-article-modal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeAddArticleModal();
        }
    });
});

// إعدادات التخزين السحابي (GitHub كقاعدة بيانات)
const CLOUD_CONFIG = {
    // يمكن استخدام GitHub Gist أو أي خدمة أخرى
    enabled: false, // سيتم تفعيلها لاحقاً
    apiUrl: 'https://api.github.com/gists',
    gistId: null // سيتم إنشاؤه تلقائياً
};

// حفظ المقالات في السحابة
async function saveArticlesToCloud(articles) {
    if (!CLOUD_CONFIG.enabled) {
        return; // التخزين السحابي معطل حالياً
    }
    
    try {
        // هنا يمكن إضافة كود للحفظ في Firebase أو أي خدمة أخرى
        console.log('سيتم إضافة التخزين السحابي قريباً');
    } catch (error) {
        console.error('خطأ في التخزين السحابي:', error);
    }
}

// جلب المقالات من السحابة
async function loadArticlesFromCloud() {
    if (!CLOUD_CONFIG.enabled) {
        return null;
    }
    
    try {
        // هنا يمكن إضافة كود للجلب من Firebase أو أي خدمة أخرى
        console.log('سيتم إضافة جلب البيانات من السحابة قريباً');
        return null;
    } catch (error) {
        console.error('خطأ في جلب البيانات من السحابة:', error);
        return null;
    }
}

// دمج البيانات المحلية والسحابية
async function getArticlesFromAllSources() {
    // جلب البيانات المحلية
    const localArticles = JSON.parse(localStorage.getItem('hajmasport_articles') || '[]');
    
    // جلب البيانات السحابية
    const cloudArticles = await loadArticlesFromCloud();
    
    if (cloudArticles && cloudArticles.length > 0) {
        // دمج البيانات وإزالة المكررات
        const allArticles = [...localArticles, ...cloudArticles];
        const uniqueArticles = allArticles.filter((article, index, self) => 
            index === self.findIndex(a => a.id === article.id)
        );
        
        // ترتيب حسب التاريخ (الأحدث أولاً)
        uniqueArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // حفظ البيانات المدمجة محلياً
        localStorage.setItem('hajmasport_articles', JSON.stringify(uniqueArticles));
        
        return uniqueArticles;
    }
    
    return localArticles;
}// مشاركة
 مقال
async function shareArticle(articleId) {
    const articles = await getArticles();
    const article = articles.find(a => a.id === articleId);
    
    if (article) {
        const articleData = encodeURIComponent(JSON.stringify(article));
        const shareURL = `${window.location.origin}/index.html?article=${articleData}`;
        
        try {
            await navigator.clipboard.writeText(shareURL);
            alert('تم نسخ رابط المقال! 🔗\nيمكنك مشاركته مع أي متصفح آخر وسيظهر المقال تلقائياً');
        } catch (error) {
            // عرض الرابط في نافذة منبثقة إذا فشل النسخ
            prompt('انسخ هذا الرابط لمشاركة المقال مع المتصفحات الأخرى:', shareURL);
        }
    }
}