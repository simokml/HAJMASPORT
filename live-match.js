// مفتاح الـ API الخاص بك
const token = "nSdbfmPCP2V8KKQ0ODIjC4LvxQN1XTiskOCBQ7ouY0iCgbp4YeUYHfAflMEf";

// عنوان الطلب من Sportmonks
const url = `https://api.sportmonks.com/v3/football/livescores?api_token=${token}`;

// الدالة التي تجلب المباريات وتعرضها
async function loadLiveMatches() {
  const container = document.getElementById("matches-container");
  container.innerHTML = "<p>جارِ تحميل المباريات...</p>";

  try {
    const response = await fetch(url);
    const data = await response.json();

    const matches = data.data;
    if (!matches || matches.length === 0) {
      container.innerHTML = "<p>لا توجد مباريات مباشرة الآن.</p>";
      return;
    }

    container.innerHTML = ""; // مسح النص السابق

    matches.forEach(match => {
      const matchCard = document.createElement("div");
      matchCard.className = "match-card";
      matchCard.innerHTML = `
        <h3>${match.name}</h3>
        <p>الحالة: ${match.time?.status || "غير متوفرة"}</p>
        <p>توقيت البداية: ${match.time?.starting_at?.time || "غير محدد"}</p>
      `;
      container.appendChild(matchCard);
    });
  } catch (error) {
    console.error("خطأ أثناء جلب البيانات:", error);
    container.innerHTML = "<p>حدث خطأ أثناء تحميل البيانات.</p>";
  }
}

// استدعاء الدالة عند تحميل الصفحة
loadLiveMatches();

// تحديث النتائج كل دقيقة
setInterval(loadLiveMatches, 60000);