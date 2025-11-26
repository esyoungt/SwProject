const players = [
  // 🔴 Goalkeepers (GK)
  {
    name: "Manuel Neuer",
    number: 1,
    position: "GK",
    img: "https://i.pinimg.com/1200x/c4/6b/28/c46b28b45a9ea56ac97736ca0f3c24d9.jpg",
    matches: 20,
    cleansheets: 7
  },

  // 🔵 Defenders (DF)
  {
    name: "Dayot Upamecano",
    number: 4,
    position: "DF",
    img: "https://i.pinimg.com/1200x/83/2a/dc/832adcb7c1ea817fbbfa6e51e6e6ac89.jpg",
    matches: 21,
    goals: 1,
    assists: 1
  },
  {
    name: "Minjae Kim",
    number: 3,
    position: "DF",
    img: "https://i.pinimg.com/1200x/82/05/21/820521cf5e33608638ad5f4dbdec016a.jpg",
    matches: 12,
    goals: 0,
    assists: 1
  },
  {
    name: "Jonathan Tah",
    number: 4,
    position: "DF",
    img: "https://i.pinimg.com/1200x/9e/41/0b/9e410b83050df1deec77bf6205fff690.jpg",
    matches: 22,
    goals: 1,
    assists: 2
  },

  // 🟡 Midfielders (MF)
  {
    name: "Joshua Kimmich",
    number: 6,
    position: "MF",
    img: "https://i.pinimg.com/1200x/51/9d/46/519d468fc9126f1d7070201700313915.jpg",
    matches: 30,
    goals: 1,
    assists: 4
  },
  {
    name: "Leon Goretzka",
    number: 8,
    position: "MF",
    img: "https://i.pinimg.com/1200x/1f/b7/bb/1fb7bb9cabee6099b180a57fa5120d57.jpg",
    matches: 27,
    goals: 4,
    assists: 5
  },
  {
    name: "Thomas Muller",
    number: 25,
    position: "MF",
    img: "https://i.pinimg.com/1200x/26/b4/3d/26b43d4e71fd50b77d843f43c8ebda05.jpg",
    matches: 29,
    goals: 9,
    assists: 14
  },
  {
    name: "Jamal Musiala",
    number: 42,
    position: "MF",
    img: "https://i.pinimg.com/1200x/5e/8f/0d/5e8f0d80115bc285327199b7a4658c19.jpg",
    matches: 29,
    goals: 9,
    assists: 6
  },
  {
    name: "Aleksandar Pavlovic",
    number: 45,
    position: "MF",
    img: "https://i.pinimg.com/736x/ef/e9/f4/efe9f49500ea800bfb3c315b19ea23f0.jpg",
    matches: 20,
    goals: 9,
    assists: 6
  },

  // ⚽ Forwards (FW)
  {
    name: "Harry Kane",
    number: 9,
    position: "FW",
    img: "https://i.pinimg.com/1200x/06/d6/e1/06d6e1012dd0d054b41fa60fd44535f6.jpg",
    matches: 31,
    goals: 32,
    assists: 8
  },
  {
    name: "Micheal Olise",
    number: 17,
    position: "FW",
    img: "https://i.pinimg.com/1200x/e0/d3/46/e0d346ab8eb218b364cc7ce1548940d9.jpg",
    matches: 23,
    goals: 12,
    assists: 10
  },
  {
    name: "Kingsley Comman",
    number: 29,
    position: "FW",
    img: "https://i.pinimg.com/1200x/69/d7/36/69d7362252fff0c6491d3be687f3f063.jpg",
    matches: 14,
    goals: 7,
    assists: 9
  },

];

// 렌더링 함수
function renderPlayers() {
  players.forEach(p => {
    const card = document.createElement("div");
    card.className = "player-card";
    card.style.backgroundImage = `url(${p.img})`;

    card.innerHTML = `
      <div class="player-number">${p.number}</div>
      <div class="player-name">${p.name}</div>
      <div class="player-stats">
        <div>Matches: ${p.matches}</div>
        ${
          p.position === 'GK'
          ? `<div>Clean Sheets: ${p.cleansheets}</div>`
          : `<div>Goals: ${p.goals}</div><div>Assists: ${p.assists}</div>`
        }
      </div>
    `;

    document.querySelector(`.player-grid[data-pos="${p.position}"]`)
      .appendChild(card);
  });
}

renderPlayers();
