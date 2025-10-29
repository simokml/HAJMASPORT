// التحقق من نوع الصفحة
function isHomePage() {
    return !window.location.search.includes('fixture=');
}

// الحصول على معرف المباراة من URL
function getFixtureIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('fixture');
}

// === جلب كل المباريات وتحديثها تلقائياً ===
async function fetchAllMatches() {
    try {
        const apiUrl = `${API_CONFIG.baseUrl}/football/fixtures?api_token=${API_CONFIG.apiKey}&include=participants,league,scores,state&sort=starting_at`;

        console.log('جلب كل المباريات من:', apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`فشل التحميل (${response.status})`);

        const data = await response.json();
        if (!data || !data.data) throw new Error('البيانات غير متوفرة أو غير صالحة');

        const matches = data.data.filter(f => f.participants && f.league);
        displayAllMatches(matches);

    } catch (error) {
        console.error('خطأ في جلب المباريات:', error);
        showError('تعذر تحميل جدول المباريات.');
    }
}

// === عرض جميع المباريات في جدول واحد ===
function displayAllMatches(matches) {
    const container = document.getElementById('matches-container');
    if (!container) return;

    container.innerHTML = '';

    if (matches.length === 0) {
        container.innerHTML = '<div style="padding:40px;text-align:center;color:#b3b3b3;">لا توجد مباريات حالياً</div>';
        return;
    }

    matches.forEach(fixture => {
        const homeTeam = fixture.participants.find(p => p.meta.location === 'home');
        const awayTeam = fixture.participants.find(p => p.meta.location === 'away');
        const league = fixture.league?.name || 'دوري غير محدد';
        const status = getMatchStatusFromStateId(fixture.state_id);
        const time = formatMatchTimeFromTimestamp(fixture.starting_at, fixture.state_id);

        const homeScore = getParticipantScore(fixture.scores, homeTeam.id);
        const awayScore = getParticipantScore(fixture.scores, awayTeam.id);

        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        matchCard.innerHTML = `
            <div class="match-league">${league}</div>
            <div class="match-info">
                <span class="team">${translateTeamName(homeTeam.name)}</span>
                <span class="score ${status.class}">${homeScore} - ${awayScore}</span>
                <span class="team">${translateTeamName(awayTeam.name)}</span>
            </div>
            <div class="match-status ${status.class}">${status.text} | ${time}</div>
        `;

        // النقر على المباراة لعرض التفاصيل
        matchCard.addEventListener('click', () => {
            window.location.href = `?fixture=${fixture.id}`;
        });

        container.appendChild(matchCard);
    });
}

// === تهيئة الصفحة الرئيسية ===
function setupHomePage() {
    fetchAllMatches(); // تحميل أولي
    setInterval(fetchAllMatches, 60000); // تحديث كل دقيقة
}

// === جلب بيانات مباراة مفردة من الـ API ===
async function fetchLiveMatchData(fixtureId) {
    try {
        const apiUrl = `${API_CONFIG.baseUrl}/football/fixtures/${fixtureId}?api_token=${API_CONFIG.apiKey}&include=participants,league,scores,state,events,statistics`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`خطأ في تحميل المباراة (${response.status})`);

        const data = await response.json();
        if (data && data.data) displayLiveMatch(data.data);
        else throw new Error('لا توجد بيانات للمباراة');

    } catch (error) {
        console.error('خطأ في جلب بيانات المباراة:', error);
        showError('فشل في تحميل بيانات المباراة.');
    }
}

// === عرض بيانات المباراة المفردة ===
function displayLiveMatch(fixture) {
    document.getElementById('match-info').style.display = 'none';
    const liveScore = document.getElementById('live-score');
    liveScore.style.display = 'flex';
    addLivePlayer(fixture.id);

    const homeTeam = fixture.participants?.find(p => p.meta?.location === 'home');
    const awayTeam = fixture.participants?.find(p => p.meta?.location === 'away');
    if (!homeTeam || !awayTeam) {
        showError('بيانات الفرق غير متوفرة');
        return;
    }

    document.getElementById('home-logo').textContent = homeTeam.name.charAt(0);
    document.getElementById('home-name').textContent = translateTeamName(homeTeam.name);
    document.getElementById('away-logo').textContent = awayTeam.name.charAt(0);
    document.getElementById('away-name').textContent = translateTeamName(awayTeam.name);

    document.getElementById('home-score').textContent = getParticipantScore(fixture.scores, homeTeam.id);
    document.getElementById('away-score').textContent = getParticipantScore(fixture.scores, awayTeam.id);

    const matchStatus = getMatchStatusFromStateId(fixture.state_id);
    const statusElement = document.getElementById('match-status');
    statusElement.textContent = matchStatus.text;
    statusElement.className = `match-status ${matchStatus.class}`;

    document.getElementById('match-time').textContent = formatMatchTimeFromTimestamp(fixture.starting_at, fixture.state_id);
    document.getElementById('league-name').textContent = fixture.league?.name || 'دوري غير محدد';

    if (fixture.statistics?.length) displayMatchStatistics(fixture.statistics);
    if (fixture.events?.length) displayMatchEvents(fixture.events);

    document.title = `${translateTeamName(homeTeam.name)} vs ${translateTeamName(awayTeam.name)} - HAJMASPORT`;
}

// === عرض الإحصائيات ===
function displayMatchStatistics(statistics) {
    const statsContainer = document.getElementById('stats-container');
    const matchStats = document.getElementById('match-stats');
    if (!statistics.length) return;

    matchStats.style.display = 'block';
    statsContainer.innerHTML = '';

    const statsByType = {};
    statistics.forEach(stat => {
        if (!statsByType[stat.type?.name]) statsByType[stat.type?.name] = {};
        statsByType[stat.type?.name][stat.participant_id] = stat.data?.value || 0;
    });

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

// === عرض الأحداث ===
function displayMatchEvents(events) {
    const eventsContainer = document.getElementById('events-container');
    const matchEvents = document.getElementById('match-events');
    if (!events.length) return;

    matchEvents.style.display = 'block';
    eventsContainer.innerHTML = '';

    events.sort((a, b) => (b.minute || 0) - (a.minute || 0));
    events.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        const icon = getEventIcon(event.type?.name);
        const minute = event.minute ? `${event.minute}'` : '--';
        const player = event.player?.name || 'لاعب غير محدد';
        eventItem.innerHTML = `
            <div class="event-time">${minute}</div>
            <div class="event-icon">${icon}</div>
            <div class="event-description">
                <div class="event-player">${player}</div>
                <div>${translateEventType(event.type?.name)}</div>
            </div>
        `;
        eventsContainer.appendChild(eventItem);
    });
}

// === المساعدات ===
function getEventIcon(type) {
    const icons = {
        'Goal': '⚽',
        'Yellow Card': '🟨',
        'Red Card': '🟥',
        'Substitution': '🔄',
        'Penalty': '⚽',
        'Own Goal': '⚽',
        'Assist': '👟'
    };
    return icons[type] || '📝';
}

function translateEventType(type) {
    const map = {
        'Goal': 'هدف',
        'Yellow Card': 'بطاقة صفراء',
        'Red Card': 'بطاقة حمراء',
        'Substitution': 'تبديل',
        'Penalty': 'ضربة جزاء',
        'Own Goal': 'هدف في المرمى',
        'Assist': 'تمريرة حاسمة'
    };
    return map[type] || type;
}

function translateStatName(name) {
    const map = {
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
    return map[name] || name;
}

function showError(msg) {
    document.getElementById('match-info').style.display = 'none';
    document.getElementById('live-score').style.display = 'none';
    document.getElementById('match-stats').style.display = 'none';
    document.getElementById('match-events').style.display = 'none';
    const errorEl = document.getElementById('error-message');
    document.getElementById('error-text').textContent = msg;
    errorEl.style.display = 'block';
}

function translateTeamName(name) {
    const map = {
        'Real Madrid': 'ريال مدريد',
        'Barcelona': 'برشلونة',
        'FC Barcelona': 'برشلونة',
        'Manchester City': 'مانشستر سيتي',
        'Liverpool': 'ليفربول',
        'Chelsea': 'تشيلسي',
        'Arsenal': 'أرسنال',
        'Paris Saint-Germain': 'باريس سان جيرمان',
        'Bayern Munich': 'بايرن ميونخ',
        'Borussia Dortmund': 'بوروسيا دورتموند',
        'Atletico Madrid': 'أتلتيكو مدريد',
        'Valencia': 'فالنسيا'
    };
    return map[name] || name;
}

function getParticipantScore(scores, id) {
    if (!scores || !scores.length) return 0;
    const s = scores.find(x => x.participant_id === id && x.type_id === 1525);
    return s ? s.score.goals : 0;
}

function getMatchStatusFromStateId(id) {
    const map = {
        1: { text: 'لم تبدأ', class: 'upcoming' },
        2: { text: 'مباشر', class: 'live' },
        3: { text: 'مباشر', class: 'live' },
        4: { text: 'استراحة', class: 'live' },
        5: { text: 'انتهت', class: 'finished' },
        6: { text: 'مؤجلة', class: 'upcoming' },
        7: { text: 'ملغاة', class: 'finished' }
    };
    return map[id] || { text: 'غير محدد', class: 'upcoming' };
}

function formatMatchTimeFromTimestamp(startingAt, stateId) {
    const date = new Date(startingAt);
    if (stateId === 2 || stateId === 3) return 'مباشر الآن';
    if (stateId === 4) return 'استراحة';
    if (stateId === 5) return 'انتهت';
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function addLivePlayer(fixtureId) {
    const livePlayer = document.getElementById('live-player');
    const playerContainer = document.getElementById('player-container');
    livePlayer.style.display = 'block';
    playerContainer.innerHTML = `
        <div class="coming-soon-player">
            <div class="animated-text">
                <span class="typing-text">سيتم بث جميع المباريات قريباً</span>
                <span class="cursor">|</span>
            </div>
            <div class="football-animation">⚽</div>
        </div>
    `;
}