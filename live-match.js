// إعدادات API
const API_KEY = '2f4faafeb7ee476096624ffc016f9d72';
const API_BASE_URL = 'https://api.football-data.org/v4';

// التحقق من نوع الصفحة
function isHomePage() {
    return !window.location.search.includes('fixture=');
}

// جلب المباريات من API
async function fetchFixtures(date = null) {
    try {
        let url;
        if (date) {
            url = `${API_BASE_URL}/matches?dateFrom=${date}&dateTo=${date}`;
        } else {
            // جلب مباريات اليوم
            const today = new Date().toISOString().split('T')[0];
            url = `${API_BASE_URL}/matches?dateFrom=${today}&dateTo=${today}`;
        }

        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.matches || [];
    } catch (error) {
        console.error('خطأ في جلب المباريات:', error);
        return [];
    }
}

// جلب المباريات المباشرة
async function fetchLiveFixtures() {
    try {
        const url = `${API_BASE_URL}/matches?status=LIVE`;

        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.matches || [];
    } catch (error) {
        console.error('خطأ في جلب المباريات المباشرة:', error);
        return [];
    }
}

// تحويل بيانات API إلى تنسيق الموقع
function formatFixtureData(match) {
    if (!match.homeTeam || !match.awayTeam) {
        return null;
    }

    // ترجمة أسماء الفرق
    const homeTeamName = translateTeamName(match.homeTeam.name);
    const awayTeamName = translateTeamName(match.awayTeam.name);

    // الحصول على النتيجة
    const homeScore = match.score?.fullTime?.home || 0;
    const awayScore = match.score?.fullTime?.away || 0;

    // تحديد حالة المباراة
    let status = 'لم تبدأ';
    let statusClass = 'not-started';

    switch (match.status) {
        case 'LIVE':
        case 'IN_PLAY':
        case 'PAUSED':
            status = 'مباشر';
            statusClass = 'live';
            break;
        case 'FINISHED':
            status = 'انتهت';
            statusClass = 'finished';
            break;
        case 'POSTPONED':
            status = 'مؤجلة';
            statusClass = 'postponed';
            break;
        case 'CANCELLED':
            status = 'ملغية';
            statusClass = 'cancelled';
            break;
        case 'SCHEDULED':
        case 'TIMED':
            status = 'لم تبدأ';
            statusClass = 'not-started';
            break;
        default:
            status = match.status;
            statusClass = 'unknown';
    }

    // تنسيق الوقت
    const matchTime = new Date(match.utcDate).toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return {
        fixtureId: match.id.toString(),
        homeTeam: homeTeamName,
        awayTeam: awayTeamName,
        homeScore: homeScore,
        awayScore: awayScore,
        status: status,
        statusClass: statusClass,
        league: match.competition?.name || 'دوري غير محدد',
        channel: 'beIN Sports HD',
        time: matchTime
    };
}

// جلب بيانات الصفحة الرئيسية من API
async function getHomePageData() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // جلب المباريات المباشرة
        const liveFixtures = await fetchLiveFixtures();
        const liveMatches = liveFixtures.map(formatFixtureData).filter(Boolean);

        // جلب مباريات اليوم
        const todayFixtures = await fetchFixtures(today);
        const todayMatches = todayFixtures.map(formatFixtureData).filter(Boolean);

        // جلب مباريات الغد
        const tomorrowFixtures = await fetchFixtures(tomorrow);
        const tomorrowMatches = tomorrowFixtures.map(formatFixtureData).filter(Boolean);

        return {
            live: liveMatches,
            today: todayMatches,
            tomorrow: tomorrowMatches
        };
    } catch (error) {
        console.error('خطأ في جلب بيانات الصفحة الرئيسية:', error);
        return getFallbackData();
    }
}

// بيانات احتياطية في حالة فشل API
function getFallbackData() {
    return {
        today: [
            {
                fixtureId: "19439347",
                homeTeam: "ريال مدريد",
                awayTeam: "برشلونة",
                homeScore: 2,
                awayScore: 1,
                status: "انتهت",
                statusClass: "finished",
                league: "الدوري الإسباني",
                channel: "beIN Sports 1 HD",
                time: "22:00"
            },
            {
                fixtureId: "19439468",
                homeTeam: "باريس سان جيرمان",
                awayTeam: "مارسيليا",
                homeScore: 0,
                awayScore: 0,
                status: "لم تبدأ",
                statusClass: "upcoming",
                league: "الدوري الفرنسي",
                channel: "beIN Sports 3 HD",
                time: "21:00"
            }
        ],
        live: [
            {
                fixtureId: "19439356",
                homeTeam: "مانشستر سيتي",
                awayTeam: "ليفربول",
                homeScore: 1,
                awayScore: 1,
                status: "مباشر",
                statusClass: "live",
                league: "الدوري الإنجليزي",
                channel: "beIN Sports 2 HD",
                time: "الدقيقة 75"
            },
            {
                fixtureId: "19573385",
                homeTeam: "أتلتيكو مدريد",
                awayTeam: "ريال مدريد",
                homeScore: 1,
                awayScore: 2,
                status: "مباشر",
                statusClass: "live",
                league: "كأس السوبر الإسباني",
                channel: "beIN Sports 1 HD",
                time: "الدقيقة 60"
            }
        ],
        tomorrow: [
            {
                fixtureId: "19439384",
                homeTeam: "تشيلسي",
                awayTeam: "أرسنال",
                homeScore: 0,
                awayScore: 0,
                status: "غداً",
                statusClass: "upcoming",
                league: "الدوري الإنجليزي",
                channel: "beIN Sports 1 HD",
                time: "18:30"
            },
            {
                fixtureId: "19439403",
                homeTeam: "بايرن ميونخ",
                awayTeam: "بوروسيا دورتموند",
                homeScore: 0,
                awayScore: 0,
                status: "غداً",
                statusClass: "upcoming",
                league: "الدوري الألماني",
                channel: "beIN Sports 2 HD",
                time: "20:30"
            }
        ]
    };
}

// الحصول على معرف المباراة من URL
function getFixtureIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('fixture');
}

// دالة لجلب بيانات المباراة المباشرة
async function fetchLiveMatchData(fixtureId) {
    try {
        const apiUrl = `${API_BASE_URL}/matches/${fixtureId}`;
        console.log('رابط API للمباراة:', apiUrl);
        console.log('معرف المباراة:', fixtureId);

        const response = await fetch(apiUrl, {
            headers: {
                'X-Auth-Token': API_KEY
            }
        });

        console.log('حالة الاستجابة:', response.status);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('المباراة غير موجودة أو معرف المباراة غير صحيح');
            } else if (response.status === 401) {
                throw new Error('مفتاح API غير صحيح أو منتهي الصلاحية');
            } else if (response.status === 403) {
                throw new Error('الوصول مرفوض - تحقق من صلاحيات API');
            } else if (response.status === 429) {
                throw new Error('تم تجاوز حد الطلبات المسموح به - يرجى المحاولة لاحقاً');
            } else if (response.status >= 500) {
                throw new Error('خطأ في خادم Football-Data.org - يرجى المحاولة لاحقاً');
            } else {
                throw new Error(`خطأ في الاتصال: ${response.status}`);
            }
        }

        const data = await response.json();
        console.log('بيانات المباراة المباشرة:', data);

        if (data) {
            displayLiveMatch(data);
        } else {
            throw new Error('لا توجد بيانات للمباراة');
        }

    } catch (error) {
        console.error('خطأ في جلب بيانات المباراة:', error);
        showError('فشل في تحميل بيانات المباراة: ' + error.message);
    }
}

// دالة لعرض بيانات المباراة المباشرة
function displayLiveMatch(match) {
    // إخفاء شاشة التحميل
    document.getElementById('match-info').style.display = 'none';

    // عرض النتيجة المباشرة
    const liveScore = document.getElementById('live-score');
    liveScore.style.display = 'flex';

    // إضافة المشغل للمباريات المحددة
    addLivePlayer(match.id);

    // التحقق من وجود بيانات الفرق
    if (!match.homeTeam || !match.awayTeam) {
        showError('بيانات الفرق غير متوفرة');
        return;
    }

    // عرض معلومات الفرق
    document.getElementById('home-logo').textContent = match.homeTeam.name.charAt(0);
    document.getElementById('home-name').textContent = translateTeamName(match.homeTeam.name);
    document.getElementById('away-logo').textContent = match.awayTeam.name.charAt(0);
    document.getElementById('away-name').textContent = translateTeamName(match.awayTeam.name);

    // عرض النتيجة
    const homeScore = match.score?.fullTime?.home || 0;
    const awayScore = match.score?.fullTime?.away || 0;

    document.getElementById('home-score').textContent = homeScore;
    document.getElementById('away-score').textContent = awayScore;

    // عرض حالة المباراة
    let statusText = 'لم تبدأ';
    switch (match.status) {
        case 'LIVE':
        case 'IN_PLAY':
            statusText = 'مباشر';
            break;
        case 'PAUSED':
            statusText = 'استراحة';
            break;
        case 'FINISHED':
            statusText = 'انتهت';
            break;
        case 'POSTPONED':
            statusText = 'مؤجلة';
            break;
        case 'CANCELLED':
            statusText = 'ملغية';
            break;
        case 'SCHEDULED':
        case 'TIMED':
            statusText = 'لم تبدأ';
            break;
    }

    const statusElement = document.getElementById('match-status');
    statusElement.textContent = statusText;
    statusElement.className = `match-status ${matchStatus.class}`;

    // عرض وقت المباراة
    document.getElementById('match-time').textContent =
        formatMatchTimeFromTimestamp(fixture.starting_at, fixture.state_id);

    // عرض اسم الدوري
    document.getElementById('league-name').textContent =
        fixture.league?.name || 'دوري غير محدد';

    // عرض الإحصائيات إذا كانت متوفرة
    if (fixture.statistics && fixture.statistics.length > 0) {
        displayMatchStatistics(fixture.statistics);
    }

    // عرض أحداث المباراة إذا كانت متوفرة
    if (fixture.events && fixture.events.length > 0) {
        displayMatchEvents(fixture.events);
    }

    // تحديث عنوان الصفحة
    document.title = `${translateTeamName(homeTeam.name)} vs ${translateTeamName(awayTeam.name)} - HAJMASPORT`;
}

// دالة لعرض إحصائيات المباراة
function displayMatchStatistics(statistics) {
    const statsContainer = document.getElementById('stats-container');
    const matchStats = document.getElementById('match-stats');

    if (statistics.length === 0) return;

    matchStats.style.display = 'block';
    statsContainer.innerHTML = '';

    // تجميع الإحصائيات حسب النوع
    const statsByType = {};
    statistics.forEach(stat => {
        if (!statsByType[stat.type?.name]) {
            statsByType[stat.type?.name] = {};
        }
        statsByType[stat.type?.name][stat.participant_id] = stat.data?.value || 0;
    });

    // عرض الإحصائيات
    Object.entries(statsByType).forEach(([statName, values]) => {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';

        const participantIds = Object.keys(values);
        if (participantIds.length >= 2) {
            statItem.innerHTML = `
                <div class="stat-value">${values[participantIds[0]] || 0}</div>
                <div class="stat-name">${translateStatName(statName)}</div>
                <div class="stat-value">${values[participantIds[1]] || 0}</div>
            `;
            statsContainer.appendChild(statItem);
        }
    });
}

// دالة لعرض أحداث المباراة
function displayMatchEvents(events) {
    const eventsContainer = document.getElementById('events-container');
    const matchEvents = document.getElementById('match-events');

    if (events.length === 0) return;

    matchEvents.style.display = 'block';
    eventsContainer.innerHTML = '';

    // ترتيب الأحداث حسب الوقت
    events.sort((a, b) => (b.minute || 0) - (a.minute || 0));

    events.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';

        const eventIcon = getEventIcon(event.type?.name);
        const eventTime = event.minute ? `${event.minute}'` : '--';
        const playerName = event.player?.name || 'لاعب غير محدد';

        eventItem.innerHTML = `
            <div class="event-time">${eventTime}</div>
            <div class="event-icon">${eventIcon}</div>
            <div class="event-description">
                <div class="event-player">${playerName}</div>
                <div>${translateEventType(event.type?.name)}</div>
            </div>
        `;

        eventsContainer.appendChild(eventItem);
    });
}

// دالة للحصول على أيقونة الحدث
function getEventIcon(eventType) {
    const icons = {
        'Goal': '⚽',
        'Yellow Card': '🟨',
        'Red Card': '🟥',
        'Substitution': '🔄',
        'Penalty': '⚽',
        'Own Goal': '⚽',
        'Assist': '👟'
    };
    return icons[eventType] || '📝';
}

// دالة لترجمة نوع الحدث
function translateEventType(eventType) {
    const translations = {
        'Goal': 'هدف',
        'Yellow Card': 'بطاقة صفراء',
        'Red Card': 'بطاقة حمراء',
        'Substitution': 'تبديل',
        'Penalty': 'ضربة جزاء',
        'Own Goal': 'هدف في المرمى',
        'Assist': 'تمريرة حاسمة'
    };
    return translations[eventType] || eventType;
}

// دالة لترجمة أسماء الإحصائيات
function translateStatName(statName) {
    const translations = {
        'Shots': 'التسديدات',
        'Shots on Goal': 'التسديدات على المرمى',
        'Possession': 'الاستحواذ',
        'Passes': 'التمريرات',
        'Fouls': 'الأخطاء',
        'Corners': 'الركنيات',
        'Offsides': 'التسلل',
        'Yellow Cards': 'البطاقات الصفراء',
        'Red Cards': 'البطاقات الحمراء'
    };
    return translations[statName] || statName;
}

// دالة لعرض مباراة تجريبية
function displayDemoMatch(fixtureId) {
    // بيانات تجريبية للمباريات
    const demoMatches = {
        '19439347': {
            homeTeam: { name: 'Real Madrid', shortName: 'ريال مدريد' },
            awayTeam: { name: 'FC Barcelona', shortName: 'برشلونة' },
            homeScore: 2,
            awayScore: 1,
            status: 'انتهت',
            statusClass: 'finished',
            league: 'الدوري الإسباني',
            time: 'انتهت'
        },
        '19439356': {
            homeTeam: { name: 'Real Madrid', shortName: 'ريال مدريد' },
            awayTeam: { name: 'Valencia', shortName: 'فالنسيا' },
            homeScore: 0,
            awayScore: 0,
            status: 'لم تبدأ',
            statusClass: 'upcoming',
            league: 'الدوري الإسباني',
            time: '15:00'
        },
        '19573385': {
            homeTeam: { name: 'Atletico Madrid', shortName: 'أتلتيكو مدريد' },
            awayTeam: { name: 'Real Madrid', shortName: 'ريال مدريد' },
            homeScore: 1,
            awayScore: 2,
            status: 'مباشر',
            statusClass: 'live',
            league: 'كأس السوبر الإسباني',
            time: 'الدقيقة 75'
        }
    };

    const match = demoMatches[fixtureId];
    if (!match) {
        showError('مباراة تجريبية غير متوفرة');
        return;
    }

    // إخفاء شاشة التحميل
    document.getElementById('match-info').style.display = 'none';

    // عرض النتيجة المباشرة
    const liveScore = document.getElementById('live-score');
    liveScore.style.display = 'flex';

    // إضافة المشغل للمباريات المحددة
    addLivePlayer(fixtureId);

    // عرض معلومات الفرق
    document.getElementById('home-logo').textContent = match.homeTeam.shortName.charAt(0);
    document.getElementById('home-name').textContent = match.homeTeam.shortName;
    document.getElementById('away-logo').textContent = match.awayTeam.shortName.charAt(0);
    document.getElementById('away-name').textContent = match.awayTeam.shortName;

    // عرض النتيجة
    document.getElementById('home-score').textContent = match.homeScore;
    document.getElementById('away-score').textContent = match.awayScore;

    // عرض حالة المباراة
    const statusElement = document.getElementById('match-status');
    statusElement.textContent = match.status;
    statusElement.className = `match-status ${match.statusClass}`;

    // عرض وقت المباراة
    document.getElementById('match-time').textContent = match.time;

    // عرض اسم الدوري
    document.getElementById('league-name').textContent = match.league;

    // تحديث عنوان الصفحة
    document.title = `${match.homeTeam.shortName} vs ${match.awayTeam.shortName} - HAJMASPORT`;

    // عرض إحصائيات تجريبية
    displayDemoStats();

    // عرض أحداث تجريبية
    displayDemoEvents(match);
}

// دالة لعرض إحصائيات تجريبية
function displayDemoStats() {
    const statsContainer = document.getElementById('stats-container');
    const matchStats = document.getElementById('match-stats');

    matchStats.style.display = 'block';
    statsContainer.innerHTML = `
        <div class="stat-item">
            <div class="stat-value">8</div>
            <div class="stat-name">التسديدات</div>
            <div class="stat-value">12</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">3</div>
            <div class="stat-name">التسديدات على المرمى</div>
            <div class="stat-value">5</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">45%</div>
            <div class="stat-name">الاستحواذ</div>
            <div class="stat-value">55%</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">387</div>
            <div class="stat-name">التمريرات</div>
            <div class="stat-value">456</div>
        </div>
    `;
}

// دالة لعرض أحداث تجريبية
function displayDemoEvents(match) {
    const eventsContainer = document.getElementById('events-container');
    const matchEvents = document.getElementById('match-events');

    matchEvents.style.display = 'block';

    const events = [
        { minute: 75, icon: '⚽', player: 'كريم بنزيما', event: 'هدف' },
        { minute: 68, icon: '🔄', player: 'لوكا مودريتش', event: 'تبديل' },
        { minute: 45, icon: '⚽', player: 'فينيسيوس جونيور', event: 'هدف' },
        { minute: 32, icon: '🟨', player: 'كاسيميرو', event: 'بطاقة صفراء' },
        { minute: 15, icon: '⚽', player: 'أنطوان جريزمان', event: 'هدف' }
    ];

    eventsContainer.innerHTML = '';
    events.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
            <div class="event-time">${event.minute}'</div>
            <div class="event-icon">${event.icon}</div>
            <div class="event-description">
                <div class="event-player">${event.player}</div>
                <div>${event.event}</div>
            </div>
        `;
        eventsContainer.appendChild(eventItem);
    });
}

// دالة لعرض رسالة خطأ
function showError(message) {
    document.getElementById('match-info').style.display = 'none';
    document.getElementById('live-score').style.display = 'none';
    document.getElementById('match-stats').style.display = 'none';
    document.getElementById('match-events').style.display = 'none';

    const errorElement = document.getElementById('error-message');
    document.getElementById('error-text').textContent = message;
    errorElement.style.display = 'block';
}

// دالة لترجمة أسماء الفرق (نفس الدالة من الملف الرئيسي)
function translateTeamName(teamName) {
    const defaultTranslations = {
        'Real Madrid': 'ريال مدريد',
        'Barcelona': 'برشلونة',
        'FC Barcelona': 'برشلونة',
        'Manchester United': 'مانشستر يونايتد',
        'Manchester City': 'مانشستر سيتي',
        'Liverpool': 'ليفربول',
        'Chelsea': 'تشيلسي',
        'Arsenal': 'أرسنال',
        'Tottenham': 'توتنهام',
        'Paris Saint-Germain': 'باريس سان جيرمان',
        'Bayern Munich': 'بايرن ميونخ',
        'Borussia Dortmund': 'بوروسيا دورتموند',
        'Juventus': 'يوفنتوس',
        'AC Milan': 'إيه سي ميلان',
        'Inter Milan': 'إنتر ميلان',
        'Atletico Madrid': 'أتلتيكو مدريد',
        'Valencia': 'فالنسيا'
    };

    const translations = (typeof TEAM_TRANSLATIONS !== 'undefined') ? TEAM_TRANSLATIONS : defaultTranslations;
    return translations[teamName] || teamName;
}

// دالة للحصول على نتيجة المشارك (نفس الدالة من الملف الرئيسي)
function getParticipantScore(scores, participantId) {
    if (!scores || scores.length === 0) return 0;

    const currentScore = scores.find(s =>
        s.participant_id === participantId &&
        s.type_id === 1525
    );

    return currentScore ? currentScore.score.goals : 0;
}

// دالة لتحديد حالة المباراة (نفس الدالة من الملف الرئيسي)
function getMatchStatusFromStateId(stateId) {
    const statusMap = {
        1: { text: 'لم تبدأ', class: 'upcoming' },
        2: { text: 'مباشر', class: 'live' },
        3: { text: 'مباشر', class: 'live' },
        4: { text: 'استراحة', class: 'live' },
        5: { text: 'انتهت', class: 'finished' },
        6: { text: 'مؤجلة', class: 'upcoming' },
        7: { text: 'ملغية', class: 'finished' }
    };

    return statusMap[stateId] || { text: 'غير محدد', class: 'upcoming' };
}

// دالة لتنسيق وقت المباراة (نفس الدالة من الملف الرئيسي)
function formatMatchTimeFromTimestamp(startingAt, stateId) {
    const matchDate = new Date(startingAt);

    if (stateId === 2 || stateId === 3) {
        return 'مباشر الآن';
    } else if (stateId === 4) {
        return 'استراحة';
    } else if (stateId === 5) {
        return 'انتهت';
    } else {
        return matchDate.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
}

// دالة لإضافة المشغل المباشر
function addLivePlayer(fixtureId) {
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
            <div class="football-animation">⚽</div>
        </div>
    `;
}



// وظائف الصفحة الرئيسية
async function setupHomePage() {
    // إظهار شاشة تحميل
    showLoadingState();

    // إظهار رسالة أن النظام يستخدم بيانات حقيقية
    console.log('🔴 النظام يستخدم الآن البيانات الحقيقية من Football-Data.org API');

    try {
        const matchesData = await getEnhancedHomePageData();

        // عرض الصفحة الرئيسية افتراضياً
        displayHomeContent(matchesData);

        // تحميل الأخبار مسبقاً (حتى لو لم تكن مرئية)
        await displayNews();

        // إعداد التبويبات
        setupHomeTabs(matchesData);

        // إعداد النقر على المباريات
        setupMatchClicks();

        // إخفاء شاشة التحميل
        hideLoadingState();

        // تحديث البيانات كل 30 ثانية
        setInterval(async () => {
            const updatedData = await getEnhancedHomePageData();
            updateCurrentView(updatedData);
        }, 30000);

    } catch (error) {
        console.error('خطأ في إعداد الصفحة الرئيسية:', error);
        hideLoadingState();
        showErrorState();
    }

    // تحديث الأخبار كل 10 ثوان للتأكد من ظهور المقالات الجديدة
    setInterval(async () => {
        // تحديث الأخبار فقط إذا كان تبويب الأخبار مرئي
        const newsSection = document.getElementById('news-section');
        if (newsSection && newsSection.style.display !== 'none') {
            await displayNews();
        }
    }, 10000);

    // تحديث الأخبار عند العودة للصفحة (مثل العودة من صفحة المسؤول)
    window.addEventListener('focus', async () => {
        await displayNews();
    });

    // مراقبة تحديثات الأخبار من لوحة التحكم
    let lastNewsUpdate = localStorage.getItem('news_updated') || '0';
    setInterval(async () => {
        const currentNewsUpdate = localStorage.getItem('news_updated') || '0';
        if (currentNewsUpdate !== lastNewsUpdate) {
            lastNewsUpdate = currentNewsUpdate;
            await displayNews();
            // تحديث الأخبار في الصفحة الرئيسية أيضاً
            await displayHomeNews();
        }
    }, 2000);
}

function displayHomeMatches(tabName, matchesData) {
    const container = document.getElementById('matches-container');
    if (!container) return;

    container.innerHTML = '';

    const matches = matchesData[tabName] || [];

    if (matches.length === 0) {
        container.innerHTML = '<div style="padding: 40px; text-align: center; color: #b3b3b3;">لا توجد مباريات في هذا القسم</div>';
        return;
    }

    matches.forEach(match => {
        const matchCard = createHomeMatchCard(match);
        container.appendChild(matchCard);
    });
}

function createHomeMatchCard(match) {
    const matchCard = document.createElement('div');
    matchCard.className = 'match-card';
    matchCard.style.cursor = 'pointer';
    matchCard.setAttribute('data-fixture-id', match.fixtureId);

    const homeTeamInitial = match.homeTeam.charAt(0);
    const awayTeamInitial = match.awayTeam.charAt(0);

    matchCard.innerHTML = `
        <div class="team-home">
            <div class="team-logo">${homeTeamInitial}</div>
            <div class="team-info">
                <div class="team-name">${match.homeTeam}</div>
                <div class="league-info">
                    <span>🏆</span>
                    <span>${match.league}</span>
                </div>
            </div>
        </div>
        
        <div class="match-center">
            <div class="match-score">${match.homeScore} - ${match.awayScore}</div>
            <div class="match-status ${match.statusClass}">${match.status}</div>
            <div class="match-time">${match.time}</div>
            <div class="channel-info">📺 ${match.channel}</div>
        </div>
        
        <div class="team-away">
            <div class="team-logo">${awayTeamInitial}</div>
            <div class="team-info">
                <div class="team-name">${match.awayTeam}</div>
                <div class="league-info">
                    <span>🏆</span>
                    <span>${match.league}</span>
                </div>
            </div>
        </div>
    `;

    return matchCard;
}

// عرض محتوى الصفحة الرئيسية
function displayHomeContent(matchesData) {
    showHomeSection();

    // عرض أحدث المباريات (مزيج من جميع الأقسام)
    displayHomeMatches(matchesData);

    // عرض أحدث الأخبار
    displayHomeNews();
}

function showHomeSection() {
    document.getElementById('home-section').style.display = 'block';
    document.getElementById('matches-section').style.display = 'none';
    document.getElementById('news-section').style.display = 'none';
}

function displayHomeMatches(matchesData) {
    const container = document.getElementById('home-matches-container');
    if (!container) return;

    container.innerHTML = '';

    // جمع أحدث المباريات من جميع الأقسام
    const allMatches = [
        ...(matchesData.live || []),
        ...(matchesData.today || []),
        ...(matchesData.tomorrow || [])
    ];

    // عرض أول 6 مباريات
    allMatches.slice(0, 6).forEach(match => {
        const matchCard = createHomeMatchCard(match);
        container.appendChild(matchCard);
    });
}

async function displayHomeNews() {
    const container = document.getElementById('home-news-container');
    if (!container) return;

    container.innerHTML = '';

    // الحصول على المقالات من جميع المصادر
    const articles = await getArticlesFromAllSources();

    if (articles.length === 0) {
        container.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #b3b3b3; grid-column: 1 / -1;">
                <p>لا توجد أخبار منشورة</p>
                <a href="admin-login.html" style="color: #e50914; text-decoration: none; font-size: 12px;">إضافة مقال</a>
            </div>
        `;
        return;
    }

    // عرض أول 4 مقالات
    articles.slice(0, 4).forEach(article => {
        const newsCard = createHomeNewsCard(article);
        container.appendChild(newsCard);
    });
}

function createHomeMatchCard(match) {
    const matchCard = document.createElement('div');
    matchCard.className = 'home-match-card';
    matchCard.style.cursor = 'pointer';
    matchCard.setAttribute('data-fixture-id', match.fixtureId);

    matchCard.innerHTML = `
        <div class="home-match-header">
            <div class="home-match-league">🏆 ${match.league}</div>
            <div class="home-match-time">${match.time}</div>
        </div>
        <div class="home-match-teams">
            <div class="home-team-name">${match.homeTeam}</div>
            <div class="home-match-score">${match.homeScore} - ${match.awayScore}</div>
            <div class="home-team-name">${match.awayTeam}</div>
        </div>
        <div class="home-match-status">${match.status}</div>
    `;

    return matchCard;
}

function createHomeNewsCard(article) {
    const newsCard = document.createElement('div');
    newsCard.className = 'home-news-card';
    newsCard.style.cursor = 'pointer';

    const articleDate = new Date(article.date).toLocaleDateString('ar-SA');

    newsCard.innerHTML = `
        <div class="home-news-title">${article.title}</div>
        <div class="home-news-meta">
            <div class="home-news-category">🏷️ ${article.category}</div>
            <div class="home-news-date">${articleDate}</div>
        </div>
        <div class="home-news-excerpt">${article.excerpt}</div>
    `;

    // إضافة حدث النقر لفتح المقال
    newsCard.addEventListener('click', () => {
        openArticleModal(article);
    });

    return newsCard;
}

function setupHomeTabs(matchesData) {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', async () => {
            // إزالة الفئة النشطة من جميع الأزرار
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // إضافة الفئة النشطة للزر المضغوط
            button.classList.add('active');

            const tabName = button.getAttribute('data-tab');

            if (tabName === 'home') {
                // عرض الصفحة الرئيسية
                displayHomeContent(matchesData);
            } else if (tabName === 'news') {
                // عرض الأخبار
                showNewsSection();
                // تحديث الأخبار في كل مرة يتم النقر على التبويب
                setTimeout(async () => await displayNews(), 100);
            } else {
                // عرض المباريات - جلب بيانات محدثة
                showMatchesSection();

                // إظهار شاشة تحميل صغيرة
                const container = document.getElementById('matches-container');
                if (container) {
                    container.innerHTML = '<div style="text-align: center; padding: 40px; color: #b3b3b3;"><div class="loading-spinner" style="margin: 0 auto 15px auto; width: 30px; height: 30px; border: 3px solid #333; border-top: 3px solid #e50914; border-radius: 50%; animation: spin 1s linear infinite;"></div>جاري تحميل المباريات...</div>';
                }

                try {
                    const updatedData = await getEnhancedHomePageData();
                    displayHomeMatches(tabName, updatedData);
                } catch (error) {
                    console.error('خطأ في تحديث المباريات:', error);
                    displayHomeMatches(tabName, matchesData); // استخدام البيانات المحفوظة
                }
            }
        });
    });
}

// عرض قسم المباريات
function showMatchesSection() {
    document.getElementById('home-section').style.display = 'none';
    document.getElementById('matches-section').style.display = 'block';
    document.getElementById('news-section').style.display = 'none';
    document.getElementById('section-title').textContent = 'جدول المباريات';
}

// عرض قسم الأخبار
function showNewsSection() {
    document.getElementById('home-section').style.display = 'none';
    document.getElementById('matches-section').style.display = 'none';
    document.getElementById('news-section').style.display = 'block';
}

// عرض الأخبار
async function displayNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    // الحصول على المقالات من جميع المصادر
    const articles = await getArticlesFromAllSources();

    // تسجيل للتشخيص
    console.log('عدد المقالات المحفوظة:', articles.length);

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
    modal.addEventListener('click', function (e) {
        if (e.target === this) {
            this.remove();
            document.body.style.overflow = 'auto';
        }
    });
}

function setupMatchClicks() {
    document.addEventListener('click', (e) => {
        const matchCard = e.target.closest('.match-card');
        if (matchCard) {
            // تأثير بصري
            matchCard.style.transform = 'scale(0.98)';
            setTimeout(() => {
                matchCard.style.transform = 'scale(1)';
            }, 150);

            // فتح صفحة المباراة المباشرة
            const fixtureId = matchCard.getAttribute('data-fixture-id');
            if (fixtureId) {
                window.location.href = `live-match.html?fixture=${fixtureId}`;
            }
        }
    });
}

// تشغيل التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const fixtureId = getFixtureIdFromUrl();

    if (!fixtureId) {
        // الصفحة الرئيسية
        setupHomePage();
    } else {
        // صفحة المباراة المباشرة
        fetchLiveMatchData(fixtureId);

        // تحديث البيانات كل 30 ثانية للمباريات المباشرة
        setInterval(() => {
            fetchLiveMatchData(fixtureId);
        }, 30000);
    }
});

// فتح نافذة عرض المقال
function openArticleModal(article) {
    // إنشاء النافذة إذا لم تكن موجودة
    let modal = document.getElementById('article-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'article-modal';
        modal.className = 'article-modal';
        modal.innerHTML = `
            <div class="article-modal-content">
                <div class="article-modal-header">
                    <h2 id="modal-article-title"></h2>
                    <button class="close-modal" onclick="closeArticleModal()">×</button>
                </div>
                <div class="article-modal-meta">
                    <span id="modal-article-category"></span>
                    <span id="modal-article-date"></span>
                    <span id="modal-article-author"></span>
                </div>
                <div class="article-modal-body">
                    <div id="modal-article-image"></div>
                    <div id="modal-article-content"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // ملء البيانات
    document.getElementById('modal-article-title').textContent = article.title;
    document.getElementById('modal-article-category').textContent = `🏷️ ${article.category}`;
    document.getElementById('modal-article-date').textContent = `📅 ${new Date(article.date).toLocaleDateString('ar-SA')}`;
    document.getElementById('modal-article-author').textContent = `✍️ ${article.author}`;
    document.getElementById('modal-article-content').innerHTML = article.content.replace(/\n/g, '<br>');

    // عرض الصورة إذا كانت موجودة
    const imageContainer = document.getElementById('modal-article-image');
    if (article.image && article.image.trim()) {
        imageContainer.innerHTML = `<img src="${article.image}" alt="${article.title}" style="width: 100%; max-width: 500px; height: auto; border-radius: 8px; margin-bottom: 20px;">`;
    } else {
        imageContainer.innerHTML = '';
    }

    // إظهار النافذة
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // إغلاق النافذة عند النقر خارجها
    modal.onclick = function (e) {
        if (e.target === modal) {
            closeArticleModal();
        }
    };
}

// إغلاق نافذة عرض المقال
function closeArticleModal() {
    const modal = document.getElementById('article-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// إظهار شاشة التحميل
function showLoadingState() {
    const container = document.querySelector('.container');
    if (container) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-state';
        loadingDiv.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #ffffff;">
                <div class="loading-spinner" style="margin: 0 auto 20px auto; width: 40px; height: 40px; border: 4px solid #333; border-top: 4px solid #e50914; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <h3>جاري تحميل المباريات الحقيقية...</h3>
                <p style="color: #b3b3b3; margin-top: 10px;">🔴 يتم جلب أحدث البيانات من Football-Data.org</p>
                <p style="color: #e50914; margin-top: 5px; font-size: 12px;">البيانات محدثة تلقائياً كل 30 ثانية</p>
            </div>
        `;
        container.appendChild(loadingDiv);
    }
}

// إخفاء شاشة التحميل
function hideLoadingState() {
    const loadingDiv = document.getElementById('loading-state');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// إظهار شاشة الخطأ
function showErrorState() {
    const container = document.querySelector('.container');
    if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #ffffff;">
                <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
                <h3>خطأ في تحميل البيانات</h3>
                <p style="color: #b3b3b3; margin: 15px 0;">لا يمكن الاتصال بخادم البيانات حالياً</p>
                <button onclick="location.reload()" style="background: #e50914; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 15px;">إعادة المحاولة</button>
            </div>
        `;
        container.appendChild(errorDiv);
    }
}

// تحديث العرض الحالي
function updateCurrentView(matchesData) {
    const activeTab = document.querySelector('.tab-btn.active');
    if (!activeTab) return;

    const tabName = activeTab.getAttribute('data-tab');

    if (tabName === 'home') {
        displayHomeContent(matchesData);
    } else if (tabName === 'news') {
        displayNews();
    } else {
        displayHomeMatches(tabName, matchesData);
    }
}

// إضافة تنسيق CSS للتحميل
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// جلب مباريات الدوريات الشهيرة
async function fetchPopularLeaguesMatches() {
    const popularCompetitions = [
        'PL',  // Premier League
        'PD',  // La Liga
        'BL1', // Bundesliga
        'SA',  // Serie A
        'FL1', // Ligue 1
        'CL',  // Champions League
        'EL'   // Europa League
    ];

    try {
        const allMatches = [];

        for (const competition of popularCompetitions) {
            const url = `${API_BASE_URL}/competitions/${competition}/matches?status=SCHEDULED,LIVE,IN_PLAY,PAUSED,FINISHED`;

            const response = await fetch(url, {
                headers: {
                    'X-Auth-Token': API_KEY
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.matches) {
                    allMatches.push(...data.matches);
                }
            }
        }

        return allMatches;
    } catch (error) {
        console.error('خطأ في جلب مباريات الدوريات الشهيرة:', error);
        return [];
    }
}

// تحسين دالة جلب البيانات لتشمل الدوريات الشهيرة
async function getEnhancedHomePageData() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // جلب المباريات المباشرة
        const liveFixtures = await fetchLiveFixtures();
        const liveMatches = liveFixtures.map(formatFixtureData).filter(Boolean);

        // جلب مباريات اليوم
        const todayFixtures = await fetchFixtures(today);
        const todayMatches = todayFixtures.map(formatFixtureData).filter(Boolean);

        // جلب مباريات الغد
        const tomorrowFixtures = await fetchFixtures(tomorrow);
        const tomorrowMatches = tomorrowFixtures.map(formatFixtureData).filter(Boolean);

        // إذا كانت البيانات قليلة، جلب من الدوريات الشهيرة
        if (todayMatches.length < 5) {
            const popularMatches = await fetchPopularLeaguesMatches();
            const formattedPopular = popularMatches.map(formatFixtureData).filter(Boolean);

            // فلترة مباريات اليوم والغد من الدوريات الشهيرة
            const todayPopular = formattedPopular.filter(match => {
                const matchDate = new Date(match.time).toISOString().split('T')[0];
                return matchDate === today;
            });

            const tomorrowPopular = formattedPopular.filter(match => {
                const matchDate = new Date(match.time).toISOString().split('T')[0];
                return matchDate === tomorrow;
            });

            todayMatches.push(...todayPopular.slice(0, 10 - todayMatches.length));
            tomorrowMatches.push(...tomorrowPopular.slice(0, 10 - tomorrowMatches.length));
        }

        return {
            live: liveMatches,
            today: todayMatches,
            tomorrow: tomorrowMatches
        };
    } catch (error) {
        console.error('خطأ في جلب البيانات المحسنة:', error);
        return await getHomePageData(); // العودة للطريقة الأساسية
    }
}

// دالة للحصول على المقالات من جميع المصادر (نسخة للصفحة الرئيسية)
async function getArticlesFromAllSources() {
    try {
        // جلب البيانات المحلية
        const localArticles = JSON.parse(localStorage.getItem('hajmasport_articles') || '[]');

        // في المستقبل يمكن إضافة جلب من السحابة هنا
        // const cloudArticles = await loadArticlesFromCloud();

        return localArticles;
    } catch (error) {
        console.error('خطأ في جلب المقالات:', error);
        return [];
    }
}

// حل مؤقت: مشاركة المقالات عبر URL
function shareArticleViaURL(article) {
    const articleData = encodeURIComponent(JSON.stringify(article));
    const shareURL = `${window.location.origin}${window.location.pathname}?article=${articleData}`;

    // نسخ الرابط للحافظة
    navigator.clipboard.writeText(shareURL).then(() => {
        alert('تم نسخ رابط المقال! يمكنك مشاركته مع المتصفحات الأخرى');
    }).catch(() => {
        // عرض الرابط في نافذة منبثقة إذا فشل النسخ
        prompt('انسخ هذا الرابط لمشاركة المقال:', shareURL);
    });
}

// تحميل مقال من URL عند فتح الصفحة
function loadArticleFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleData = urlParams.get('article');

    if (articleData) {
        try {
            const article = JSON.parse(decodeURIComponent(articleData));

            // إضافة المقال للتخزين المحلي إذا لم يكن موجوداً
            const existingArticles = JSON.parse(localStorage.getItem('hajmasport_articles') || '[]');
            const articleExists = existingArticles.some(a => a.id === article.id);

            if (!articleExists) {
                existingArticles.unshift(article);
                localStorage.setItem('hajmasport_articles', JSON.stringify(existingArticles));

                // إشعار المستخدم
                setTimeout(() => {
                    alert('تم إضافة مقال جديد من الرابط المشارك! 📰');
                    // إعادة تحميل الأخبار
                    displayNews();
                    displayHomeNews();
                }, 1000);
            }

            // إزالة المعامل من URL
            window.history.replaceState({}, document.title, window.location.pathname);

        } catch (error) {
            console.error('خطأ في تحميل المقال من URL:', error);
        }
    }
}

// تشغيل تحميل المقال من URL عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadArticleFromURL();
});