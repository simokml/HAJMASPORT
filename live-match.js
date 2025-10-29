// التحقق من نوع الصفحة
function isHomePage() {
    return !window.location.search.includes('fixture=');
}

// بيانات احتياطية للصفحة الرئيسية
function getHomePageData() {
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
        const apiUrl = `${API_CONFIG.baseUrl}/football/fixtures/${fixtureId}?api_token=${API_CONFIG.apiKey}&include=participants,league,scores,state,events,statistics`;
        console.log('رابط API للمباراة:', apiUrl);
        console.log('معرف المباراة:', fixtureId);
        
        const response = await fetch(apiUrl);
        
        console.log('حالة الاستجابة:', response.status);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('المباراة غير موجودة أو معرف المباراة غير صحيح');
            } else if (response.status === 401) {
                throw new Error('مفتاح API غير صحيح أو منتهي الصلاحية');
            } else if (response.status === 429) {
                throw new Error('تم تجاوز حد الطلبات المسموح به');
            } else {
                throw new Error(`خطأ في الخادم: ${response.status}`);
            }
        }
        
        const data = await response.json();
        console.log('بيانات المباراة المباشرة:', data);
        
        if (data && data.data) {
            displayLiveMatch(data.data);
        } else if (data && data.error) {
            throw new Error(`خطأ من API: ${data.error}`);
        } else {
            throw new Error('لا توجد بيانات للمباراة أو تنسيق البيانات غير صحيح');
        }
        
    } catch (error) {
        console.error('خطأ في جلب بيانات المباراة:', error);
        
        // إذا كانت المباراة من البيانات الاحتياطية، عرض بيانات تجريبية
        if (fixtureId.startsWith('demo-') || ['19439347', '19439356', '19573385', '19439468', '19439384', '19439403', '19568579'].includes(fixtureId)) {
            displayDemoMatch(fixtureId);
        } else {
            showError('فشل في تحميل بيانات المباراة: ' + error.message);
        }
    }
}

// دالة لعرض بيانات المباراة المباشرة
function displayLiveMatch(fixture) {
    // إخفاء شاشة التحميل
    document.getElementById('match-info').style.display = 'none';
    
    // عرض النتيجة المباشرة
    const liveScore = document.getElementById('live-score');
    liveScore.style.display = 'flex';
    
    // إضافة المشغل للمباريات المحددة
    addLivePlayer(fixture.id);
    
    // الحصول على بيانات الفرق
    const homeTeam = fixture.participants?.find(p => p.meta?.location === 'home');
    const awayTeam = fixture.participants?.find(p => p.meta?.location === 'away');
    
    if (!homeTeam || !awayTeam) {
        showError('بيانات الفرق غير متوفرة');
        return;
    }
    
    // عرض معلومات الفرق
    document.getElementById('home-logo').textContent = homeTeam.name.charAt(0);
    document.getElementById('home-name').textContent = translateTeamName(homeTeam.name);
    document.getElementById('away-logo').textContent = awayTeam.name.charAt(0);
    document.getElementById('away-name').textContent = translateTeamName(awayTeam.name);
    
    // عرض النتيجة
    const homeScore = getParticipantScore(fixture.scores, homeTeam.id);
    const awayScore = getParticipantScore(fixture.scores, awayTeam.id);
    
    document.getElementById('home-score').textContent = homeScore;
    document.getElementById('away-score').textContent = awayScore;
    
    // عرض حالة المباراة
    const matchStatus = getMatchStatusFromStateId(fixture.state_id);
    const statusElement = document.getElementById('match-status');
    statusElement.textContent = matchStatus.text;
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
    
    // عرض رسالة أن هذه بيانات تجريبية
    const container = document.querySelector('.container');
    const demoNotice = document.createElement('div');
    demoNotice.style.cssText = 'background: #333; color: #e50914; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; border: 1px solid #e50914;';
    demoNotice.innerHTML = '📡 هذه بيانات تجريبية. للحصول على بيانات حقيقية، يرجى التأكد من صحة معرف المباراة ومفتاح API.';
    container.insertBefore(demoNotice, container.children[1]);
    
    // تحديث عنوان الصفحة
    document.title = `${match.homeTeam.shortName} vs ${match.awayTeam.shortName} - HAJMASPORT (تجريبي)`;
    
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
    
    // إعداد التبويبات
    setupHomeTabs(matchesData);
    
    // إعداد النقر على المباريات
    setupMatchClicks();
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

function setupHomeTabs(matchesData) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // إزالة الفئة النشطة من جميع الأزرار
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // إضافة الفئة النشطة للزر المضغوط
            button.classList.add('active');
            
            // عرض المباريات المناسبة
            const tabName = button.getAttribute('data-tab');
            displayHomeMatches(tabName, matchesData);
        });
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