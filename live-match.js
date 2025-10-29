// -------------------------------------------
//  ⚽ سكربت الصفحة الرئيسية HAJMASPORT
// -------------------------------------------

// التحقق من الصفحة الرئيسية
function isHomePage() {
  return !window.location.search.includes("fixture=");
}

// بيانات الصفحة الرئيسية التجريبية
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
        time: "22:00",
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
        time: "21:00",
      },
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
        time: "الدقيقة 75",
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
        time: "الدقيقة 60",
      },
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
        time: "18:30",
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
        time: "20:30",
      },
    ],
  };
}

// -------------------------------------------
// وظائف الصفحة الرئيسية
// -------------------------------------------

// إعداد الصفحة الرئيسية
function setupHomePage() {
  const matchesData = getHomePageData();

  // عرض مباريات اليوم عند البداية
  displayHomeMatches("today", matchesData);

  // إعداد التبويبات
  setupHomeTabs(matchesData);

  // إعداد النقر على البطاقات
  setupMatchClicks();
}

// عرض المباريات في الصفحة الرئيسية
function displayHomeMatches(tabName, matchesData) {
  const container = document.getElementById("matches-container");
  if (!container) return;

  container.innerHTML = "";

  const matches = matchesData[tabName] || [];

  if (matches.length === 0) {
    container.innerHTML =
      '<div style="padding: 40px; text-align: center; color: #b3b3b3;">لا توجد مباريات في هذا القسم</div>';
    return;
  }

  matches.forEach((match) => {
    const card = createHomeMatchCard(match);
    container.appendChild(card);
  });
}

// إنشاء بطاقة مباراة واحدة
function createHomeMatchCard(match) {
  const card = document.createElement("div");
  card.className = "match-card";
  card.dataset.fixture = match.fixtureId;

  card.innerHTML = `
      <div class="match-row">
        <div class="teams">
          <div class="team home">
            <div class="logo">${match.homeTeam.charAt(0)}</div>
            <div class="name">${match.homeTeam}</div>
          </div>
          <div class="score">
            <span class="home-score">${match.homeScore}</span>
            <span class="sep">-</span>
            <span class="away-score">${match.awayScore}</span>
          </div>
          <div class="team away">
            <div class="logo">${match.awayTeam.charAt(0)}</div>
            <div class="name">${match.awayTeam}</div>
          </div>
        </div>
        <div class="meta">
          <div class="league">${match.league}</div>
          <div class="time">${match.time}</div>
          <div class="status ${match.statusClass}">${match.status}</div>
        </div>
      </div>
  `;

  return card;
}

// إعداد التبويبات
function setupHomeTabs(matchesData) {
  const tabs = document.querySelectorAll(".home-tab");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const tabName = tab.dataset.tab;
      displayHomeMatches(tabName, matchesData);
    });
  });
}

// إعداد النقر على المباريات (للانتقال إلى صفحة المباراة)
function setupMatchClicks() {
  const container = document.getElementById("matches-container");
  if (!container) return;

  container.addEventListener("click", (e) => {
    const card = e.target.closest(".match-card");
    if (!card) return;
    const fixtureId = card.dataset.fixture;
    if (fixtureId) {
      window.location.search = `?fixture=${fixtureId}`;
    }
  });
}

// -------------------------------------------
// تشغيل الصفحة الرئيسية عند تحميل DOM
// -------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  try {
    if (isHomePage()) {
      setupHomePage();
    } else {
      console.log("ليست الصفحة الرئيسية.");
    }
  } catch (error) {
    console.error("خطأ أثناء تحميل الصفحة:", error);
  }
});