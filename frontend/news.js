// news.js

document.addEventListener("DOMContentLoaded", () => {
  const breakingList = document.getElementById("breakingList");
  const newsGrid = document.getElementById("newsGrid");

  if (!breakingList || !newsGrid) return;

  // ----- 속보 더미 데이터 -----
  const breakingNews = [
    {
      time: "3시간 전",
      title: "FIFA, UEFA와 공동 협의… 유럽 슈퍼리그 개편 논의 본격화"
    },
    {
      time: "3시간 전",
      title: "뮌헨, 다음 시즌 대형 공격수 영입 추진… 케인과 투톱 구성 검토"
    },
    {
      time: "4시간 전",
      title: "우파메카노 부상 재검진, 라이프치히전 출전 여부는 경기 당일 결정"
    }
  ];

  // ----- 일반 뉴스 카드 더미 데이터 -----
  const newsCards = [
    {
      tag: "분데스리가",
      title: "손흥민-케인 재회? '쿠머니언스 파크' 개장 경기에서 뮌헨과 토트넘 평가전 추진",
      time: "2025년 11월 22일",
      comments: 12,
      image: "https://i.pinimg.com/1200x/2c/78/96/2c7896eedbc0407c68125e01b1f8f995.jpg"
    },
    {
      tag: "이적시장",
      title: "뮌헨이 노리는 차세대 풀백, '미래의 알바'라 불리는 20세 재능",
      time: "2025년 11월 22일",
      comments: 4,
      image: "https://i.pinimg.com/1200x/0e/28/a8/0e28a86f58fd7a6036dcd231a60a5ec0.jpg"
    },
    {
      tag: "CL 하이라이트",
      title: "뮌헨, 챔피언스리그 조별리그 전승… '우승 후보 1순위' 평가",
      time: "2025년 11월 21일",
      comments: 8,
      image: "https://i.pinimg.com/1200x/34/1f/65/341f654285dbe9afd8675effef16f417.jpg"
    },
    {
      tag: "분석",
      title: "투헬 감독의 전술 변화, 더 강해진 전방 압박과 하프스페이스 활용",
      time: "2025년 11월 20일",
      comments: 5,
      image: "https://i.pinimg.com/1200x/8d/7d/57/8d7d578903063af09ce2a4eefa74c5fd.jpg"
    },
    {
      tag: "클럽 소식",
      title: "알리안츠 아레나, 친환경 조명 시스템 도입… 전력 사용 30% 절감",
      time: "2025년 11월 19일",
      comments: 0,
      image: "https://i.pinimg.com/1200x/7b/31/c3/7b31c3b656a16383a113a0b28c52a1fb.jpg"
    },
    {
      tag: "유스 아카데미",
      title: "뮌헨 유스 출신 공격수, 1군 데뷔전에서 데뷔골 폭발",
      time: "2025년 11월 18일",
      comments: 3,
      image: "https://i.pinimg.com/1200x/3b/2a/b7/3b2ab7a2b596fdc3f6e3d7d7995ac4df.jpg"
    }
  ];

  renderBreaking(breakingNews);
  renderNews(newsCards);

  function renderBreaking(list) {
    breakingList.innerHTML = "";
    list.forEach(item => {
      const div = document.createElement("article");
      div.className = "breaking-item";
      div.innerHTML = `
        <div class="breaking-time">${item.time}</div>
        <div class="breaking-headline">${item.title}</div>
      `;
      breakingList.appendChild(div);
    });
  }

  function renderNews(cards) {
    newsGrid.innerHTML = "";
    cards.forEach(card => {
      const article = document.createElement("article");
      article.className = "news-card";
      article.innerHTML = `
        <div class="news-thumb">
          <img src="${card.image}" alt="${card.tag}">
        </div>
        <div class="news-content">
          <div class="news-tag">${card.tag}</div>
          <div class="news-title">${card.title}</div>
          <div class="news-meta">
            <span>🕒 ${card.time}</span>
            <span>💬 ${card.comments}</span>
          </div>
        </div>
      `;
      newsGrid.appendChild(article);
    });
  }
});
