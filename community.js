// community.js

document.addEventListener("DOMContentLoaded", () => {
  const feed = document.querySelector(".community-feed");
  if (!feed) return;

  // 나중에 서버에서 불러올 게시물 배열 (현재는 연동 전이라 비워둠)
  const posts = [];

  if (posts.length === 0) {
    feed.innerHTML = `
      <p>
        게시물이 없습니다. 첫 게시물을 남겨보세요!
      </p>
    `;
    return;
  }

  // 앞으로 DB 연동 후 쓸 렌더링 함수 구조
  renderPosts(posts);
});

function renderPosts(posts) {
  const feed = document.querySelector(".community-feed");
  if (!feed) return;

  feed.innerHTML = "";

  posts.forEach((post) => {
    const article = document.createElement("article");
    article.className = "post-card";

    article.innerHTML = `
      <header class="post-user">
        <img src="${post.profileImg}" alt="profile">
        <span>${post.username}</span>
      </header>

      <div class="post-media">
        ${
          post.mediaType === "video"
            ? `<video controls>
                 <source src="${post.media}" type="video/mp4">
               </video>`
            : `<img src="${post.media}" alt="post image">`
        }
      </div>

      <div class="post-actions">
        ❤️ 좋아요 <span>${post.likes}</span> · 💬 댓글 <span>${post.comments}</span>
      </div>

      <div class="post-desc">
        ${post.text}
      </div>
    `;

    feed.appendChild(article);
  });
}
