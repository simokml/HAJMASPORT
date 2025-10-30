<!DOCTYPE html>
<html lang="ar">
<head>
<meta charset="UTF-8" />
<title>مباريات آرسنال وتشيلسي موسم 2016-2017</title>
<style>
  .match-card {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px 0;
  }
</style>
</head>
<body>

<h1>مباريات آرسنال ضد تشيلسي - موسم 2016-2017</h1>
<div id="matches-container"></div>

<script>
  // API Key من TheSportsDB
  const API_KEY = '17a4ffebc735e0e01fa9fbada13e426ccf7f335aaca7d7cda3a6a9ee93cf28dc';
  
  // استخدام API Key في الرابط
  const url = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/searchevents.php?e=Arsenal_vs_Chelsea&s=2016-2017`;

  async function loadMatchData() {
    const container = document.getElementById("matches-container");
    container.innerHTML = "<p>جارِ تحميل بيانات المباريات...</p>";

    try {
      const response = await fetch(url);
      const data = await response.json();

      const events = data.event;
      if (!events || events.length === 0) {
        container.innerHTML = "<p>لا توجد مباريات متاحة.</p>";
        return;
      }

      container.innerHTML = ""; // مسح النص السابق
      events.forEach(match => {
        const matchCard = document.createElement("div");
        matchCard.className = "match-card";
        matchCard.innerHTML = `
          <h3>${match.strEvent}</h3>
          <p>الدوري: ${match.strLeague}</p>
          <p>الموسم: ${match.strSeason}</p>
          <p>النتيجة: ${match.intHomeScore} - ${match.intAwayScore}</p>
          <p>التاريخ: ${match.dateEvent}</p>
          ${match.strVideo ? `<a href="${match.strVideo}" target="_blank">فيديو المباراة</a>` : ""}
        `;
        container.appendChild(matchCard);
      });
    } catch (error) {
      console.error("خطأ أثناء جلب البيانات:", error);
      container.innerHTML = "<p>حدث خطأ أثناء تحميل البيانات.</p>";
    }
  }

  window.onload = loadMatchData;
</script>

</body>
</html>