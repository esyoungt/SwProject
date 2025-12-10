// fixtures.js

document.addEventListener("DOMContentLoaded", () => {
  const matchList = document.querySelector(".match-list");
  if (!matchList) return;

  const matches = [
    {
      month: 11,
      home: {
        name: "FC Bayern",
        logo: "https://i.pinimg.com/1200x/a7/26/db/a726db78d1229cba0f76b4ec54dcc580.jpg"
      },
      away: {
        name: "Borussia Dortmund",
        logo: "https://i.pinimg.com/1200x/eb/03/96/eb0396580edf700c2135d16e25edfb84.jpg"
      },
      score: "2 - 1",
      highlightEmbed: `
        <iframe width="100%" height="260"
          src="https://www.youtube.com/embed/CHvxKdUZ3ME?si=km32JZq7zJkVTOFv"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen>
        </iframe>
      `,
      events: [
        { side: "home", type: "goal",   text: "케인 29'" },
        { side: "home", type: "goal", text: "키미히 45'" },
        { side: "away", type: "goal",    text: "훔멜스 77'" }
      ]
    }
  ];

  renderMatches(matches);

  function renderMatches(data) {
    matchList.innerHTML = "";

    data.forEach((match, index) => {
      const item = document.createElement("li");
      item.className = "match-item";

      let eventsHtml = "";
      if (match.events && match.events.length > 0) {
        eventsHtml =
          `<div class="match-events">` +
          match.events
            .map((ev) => {
              let icon = "•";
              if (ev.type === "goal") icon = "⚽";
              else if (ev.type === "yellow") icon = "🟨";
              else if (ev.type === "red") icon = "🟥";

              const homeText = ev.side === "home" ? ev.text : "";
              const awayText = ev.side === "away" ? ev.text : "";

              return `
                <div class="event-row">
                  <span class="event-text home">${homeText}</span>
                  <span class="event-icon ${ev.type}">${icon}</span>
                  <span class="event-text away">${awayText}</span>
                </div>
              `;
            })
            .join("") +
          `</div>`;
      }

      item.innerHTML = `
        <div class="match-main" data-index="${index}">
          <div class="team">
            <img src="${match.home.logo}" alt="${match.home.name}">
            <span>${match.home.name}</span>
          </div>
          <div class="score">${match.score}</div>
          <div class="team">
            <span>${match.away.name}</span>
            <img src="${match.away.logo}" alt="${match.away.name}">
          </div>
          <div class="toggle-icon">˅</div>
        </div>

        <div class="match-detail">
          ${eventsHtml}
          <p class="highlight-title">📌 하이라이트 영상</p>
          ${match.highlightEmbed}
        </div>
      `;

      matchList.appendChild(item);
    });

    document.querySelectorAll(".match-main").forEach((main) => {
      main.addEventListener("click", () => {
        const detail = main.nextElementSibling;
        const icon = main.querySelector(".toggle-icon");
        const open = detail.style.display === "block";

        detail.style.display = open ? "none" : "block";
        icon.style.transform = open ? "rotate(0)" : "rotate(180deg)";
      });
    });
  }
});
