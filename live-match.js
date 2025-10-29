// -------------------------------------------------------
// 🔥 كود الصفحة الرئيسية HAJMASPORT (متوافق مع HTML المرسل)
// -------------------------------------------------------

function isHomePage() {
  return !window.location.search.includes("fixture=");
}

// بيانات المباريات التجريبية
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

// -------------------------------------------------------
// 🔹 عرض المباريات في الصفحة
// -------------------------------------------------------

function setupHomePage() {
  const matchesData = getHomePageData();

  // عرض مباريات اليوم عند التحميل
  displayHomeMatches("today", matchesData);

  // تفعيل الأزرار العلوية
  setupTabs(matchesData);
}

// دالة عرض المباريات
function displayHomeMatches(tabName, matchesData) {
  const container = document.getElementById("matches-container");
  if (!container) return;

  container.innerHTML = ""; // تنظيف القديم

  const matches = matchesData[tabName] || [];

  if (matches.length === 0) {
    container.innerHTML =
      '<div style="text-align:center; padding:40px; color:#999;">لا توجد مباريات في هذا القسم</div>';
    return;
  }

  matches.forEach((match) => {
    const card = document.createElement("div");
    card.className = "match-card";
    card.dataset.fixture = match.fixtureId;

    card.innerHTML = `
      <div class="teams-row">
        <div class="team">
          <div class="team-name">${match.homeTeam}</div>
        </div>
        <div class="score">
          <span>${match.homeScore}</span> - <span>${match.awayScore}</span>
        </div>
        <div class="team">
          <div class="team-name">${match.awayTeam}</div>
        </div>
      </div>
      <div class="meta">
        <span class="league">${match.league}</span>
        <span class="time">${match.time}</span>
        <span class="status ${match.statusClass}">${match.status}</span>
      </div>
    `;

    container.appendChild(card);
  });
}

// -------------------------------------------------------
// 🔹 إعداد أزرار التبويبات (اليوم / مباشر / غداً / الأخبار)
// -------------------------------------------------------
function setupTabs(matchesData) {
  const tabs = document.querySelectorAll(".tab-btn");
  const sectionTitle = document.getElementById("section-title");
  const newsSection = document.getElementById("news-section");
  const matchesSection = document.getElementById("matches-section");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const tabName = tab.dataset.tab;

      // التبديل بين الأقسام
      if (tabName === "news") {
        matchesSection.style.display = "none";
        newsSection.style.display = "block";
        sectionTitle.textContent = "آخر الأخبار الرياضية";
      } else {
        newsSection.style.display = "none";
        matchesSection.style.display = "block";

        let title = "جدول المباريات";
        if (tabName === "today") title = "مباريات اليوم";
        if (tabName === "live") title = "مباريات مباشرة";
        if (tabName === "tomorrow") title = "مباريات الغد";
        sectionTitle.textContent = title;

        displayHomeMatches(tabName, matchesData);
      }
    });
  });
}

// -------------------------------------------------------
// 🔹 تشغيل الكود عند تحميل الصفحة
// -------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  if (isHomePage()) setupHomePage();
});