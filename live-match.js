@@ -388,15 +388,8 @@ function displayDemoMatch(fixtureId) {
    // عرض اسم الدوري
    document.getElementById('league-name').textContent = match.league;

    // عرض رسالة أن هذه بيانات تجريبية
    const container = document.querySelector('.container');
    const demoNotice = document.createElement('div');
    demoNotice.style.cssText = 'background: #333; color: #e50914; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; border: 1px solid #e50914;';
    demoNotice.innerHTML = '📡 هذه بيانات تجريبية. للحصول على بيانات حقيقية، يرجى التأكد من صحة معرف المباراة ومفتاح API.';
    container.insertBefore(demoNotice, container.children[1]);
    
    // تحديث عنوان الصفحة
    document.title = `${match.homeTeam.shortName} vs ${match.awayTeam.shortName} - HAJMASPORT (تجريبي)`;
    document.title = `${match.homeTeam.shortName} vs ${match.awayTeam.shortName} - HAJMASPORT`;

    // عرض إحصائيات تجريبية
    displayDemoStats();
@@ -552,82 +545,31 @@ function formatMatchTimeFromTimestamp(startingAt, stateId) {

// دالة لإضافة المشغل المباشر
function addLivePlayer(fixtureId) {
    // قائمة المباريات التي تحتوي على بث مباشر
    const liveStreams = {
        '19573385': 'https://br.kora1goal.com/albaplayer/sports-3/?serv=0', // أتلتيكو مدريد vs ريال مدريد
        '19439347': 'https://br.kora1goal.com/albaplayer/sports-1/?serv=0', // ريال مدريد vs برشلونة
        '19439356': 'https://br.kora1goal.com/albaplayer/sports-2/?serv=0'  // ريال مدريد vs فالنسيا
    };
    
    const streamUrl = liveStreams[fixtureId];
    
    if (streamUrl) {
        const livePlayer = document.getElementById('live-player');
        const playerContainer = document.getElementById('player-container');
        
        // عرض المشغل
        livePlayer.style.display = 'block';
        
        // إضافة شاشة تحميل
        playerContainer.innerHTML = `
            <div class="player-loading">
                <div class="spinner"></div>
                <p>جاري تحميل البث المباشر...</p>
    const livePlayer = document.getElementById('live-player');
    const playerContainer = document.getElementById('player-container');
    
    // عرض المشغل
    livePlayer.style.display = 'block';
    
    // إضافة الكتابة المتحركة
    playerContainer.innerHTML = `
        <div class="coming-soon-player">
            <div class="animated-text">
                <span class="typing-text">سيتم بث جميع المباريات إنشاء الله قريباً</span>
                <span class="cursor">|</span>
            </div>
        `;
        
        // إضافة المشغل بعد ثانيتين
        setTimeout(() => {
            playerContainer.innerHTML = `
                <iframe 
                    allowfullscreen="true" 
                    frameborder="0" 
                    height="500px" 
                    scrolling="no" 
                    src="${streamUrl}" 
                    width="100%"
                    allow="autoplay; fullscreen">
                </iframe>
            `;
        }, 2000);
    }
            <div class="football-animation">⚽</div>
        </div>
    `;
}

// دالة لتبديل ملء الشاشة
function toggleFullscreen() {
    const iframe = document.querySelector('.player-container iframe');
    if (iframe) {
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.webkitRequestFullscreen) {
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) {
            iframe.msRequestFullscreen();
        }
    }
}

// دالة لإعادة تحميل المشغل
function refreshPlayer() {
    const iframe = document.querySelector('.player-container iframe');
    if (iframe) {
        const src = iframe.src;
        iframe.src = '';
        setTimeout(() => {
            iframe.src = src;
        }, 500);
    }
}

// وظائف الصفحة الرئيسية
function setupHomePage() {
    const matchesData = getHomePageData();

    // إظهار رسالة البيانات التجريبية
    const apiNotice = document.getElementById('api-notice');
    if (apiNotice) {
        apiNotice.style.display = 'block';
    }


    // عرض مباريات اليوم افتراضياً
    displayHomeMatches('today', matchesData);
@@ -712,13 +654,144 @@ function setupHomeTabs(matchesData) {
            // إضافة الفئة النشطة للزر المضغوط
            button.classList.add('active');

            // عرض المباريات المناسبة
            const tabName = button.getAttribute('data-tab');
            displayHomeMatches(tabName, matchesData);
            
            if (tabName === 'news') {
                // عرض الأخبار
                showNewsSection();
                displayNews();
            } else {
                // عرض المباريات
                showMatchesSection();
                displayHomeMatches(tabName, matchesData);
            }
        });
    });
}

// عرض قسم المباريات
function showMatchesSection() {
    document.getElementById('matches-section').style.display = 'block';
    document.getElementById('news-section').style.display = 'none';
    document.getElementById('section-title').textContent = 'جدول المباريات';
}

// عرض قسم الأخبار
function showNewsSection() {
    document.getElementById('matches-section').style.display = 'none';
    document.getElementById('news-section').style.display = 'block';
}

// عرض الأخبار
function displayNews() {
    const container = document.getElementById('news-container');
    if (!container) return;
    
    // الحصول على المقالات من التخزين المحلي
    const articles = JSON.parse(localStorage.getItem('hajmasport_articles') || '[]');
    
    container.innerHTML = '';
    
    if (articles.length === 0) {
        container.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #b3b3b3;">
                <h3>📰 لا توجد أخبار منشورة</h3>
                <p>لم يتم نشر أي مقالات بعد</p>
                <a href="admin-login.html" style="color: #e50914; text-decoration: none;">تسجيل الدخول لإضافة مقالات</a>
            </div>
        `;
        return;
    }
    
    // عرض آخر 10 مقالات
    articles.slice(0, 10).forEach(article => {
        const newsCard = createNewsCard(article);
        container.appendChild(newsCard);
    });
}

// إنشاء بطاقة خبر
function createNewsCard(article) {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-card';
    newsCard.style.cursor = 'pointer';
    
    const articleDate = new Date(article.date).toLocaleDateString('ar-SA');
    const defaultImage = 'https://via.placeholder.com/120x80/333333/e50914?text=📰';
    
    newsCard.innerHTML = `
        <div class="news-image">
            <img src="${article.image || defaultImage}" alt="${article.title}" onerror="this.src='${defaultImage}'">
        </div>
        <div class="news-content">
            <h3 class="news-title">${article.title}</h3>
            <p class="news-excerpt">${article.excerpt}</p>
            <div class="news-meta">
                <span class="news-category">${article.category}</span>
                <span class="news-author">✍️ ${article.author}</span>
                <span class="news-date">📅 ${articleDate}</span>
            </div>
        </div>
    `;
    
    // إضافة حدث النقر لعرض المقال كاملاً
    newsCard.addEventListener('click', () => {
        showFullArticle(article);
    });
    
    return newsCard;
}

// عرض المقال كاملاً في نافذة منبثقة
function showFullArticle(article) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.9); z-index: 1000; overflow-y: auto;
        display: flex; align-items: center; justify-content: center; padding: 20px;
    `;
    
    const articleDate = new Date(article.date).toLocaleDateString('ar-SA');
    const defaultImage = 'https://via.placeholder.com/600x300/333333/e50914?text=📰+' + encodeURIComponent(article.title);
    
    modal.innerHTML = `
        <div style="background: #1f1f1f; padding: 30px; border-radius: 15px; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #e50914; margin: 0;">${article.title}</h2>
                <button onclick="this.closest('.modal').remove()" style="background: #666; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">✕</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <img src="${article.image || defaultImage}" alt="${article.title}" 
                     style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 10px;"
                     onerror="this.src='${defaultImage}'">
            </div>
            
            <div style="display: flex; gap: 20px; margin-bottom: 20px; font-size: 14px; color: #b3b3b3;">
                <span style="background: #e50914; color: white; padding: 4px 8px; border-radius: 10px;">${article.category}</span>
                <span>✍️ ${article.author}</span>
                <span>📅 ${articleDate}</span>
            </div>
            
            <div style="color: #cccccc; line-height: 1.8; font-size: 16px;">
                ${article.content.replace(/\n/g, '<br>')}
            </div>
        </div>
    `;
    
    modal.className = 'modal';
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // إغلاق النافذة عند النقر خارجها
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
            document.body.style.overflow = 'auto';
        }
    });
}

function setupMatchClicks() {
    document.addEventListener('click', (e) => {
        const matchCard = e.target.closest('.match-card');