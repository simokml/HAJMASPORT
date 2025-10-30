const url = "https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=Arsenal_vs_Chelsea&s=2016-2017";
async function loadMatchData() {
  const container = document.getElementById("matches-container");
  container.innerHTML = "<p>جارِ تحميل بيانات المباريات...</p>";
  try {
    const response = await fetch(url);
    const data = await response.json();
    const events = data.event || [];
    if (events.length === 0) {
      container.innerHTML = "<p>لا توجد مباريات متاحة.</p>";
      return;
    }
    container.innerHTML = "";
    events.forEach(match => {
      const matchCard = document.createElement("div");
      matchCard.className = "match-card";
      matchCard.innerHTML = `<h3>${match.strEvent}</h3><p>التاريخ: ${match.dateEvent}</p>`;
      container.appendChild(matchCard);
    });
  } catch (error) {
    console.error("خطأ في تحميل البيانات:", error);
    container.innerHTML = "<p>حدث خطأ أثناء تحميل البيانات.</p>";
  }
}
loadMatchData();