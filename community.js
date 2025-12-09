// community.js
console.log("community.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const writeBtn = document.getElementById("writePostBtn");
  const writeSection = document.getElementById("writeSection");
  const writeForm = document.getElementById("writeForm");
  const cancelWriteBtn = document.getElementById("cancelWriteBtn");
  const titleInput = document.getElementById("postTitle");
  const contentInput = document.getElementById("postContent");
  const mediaUrlInput = document.getElementById("postMediaUrl");
  const feed = document.getElementById("communityFeed");

  // 항상 최신 로그인 정보를 읽기 위한 함수
  function getCurrentUser() {
    const saved =
      localStorage.getItem("user") || localStorage.getItem("fb_user");
    return saved ? JSON.parse(saved) : null;
  }

  // 글쓰기 버튼: 폼 열기
  if (writeBtn) {
    writeBtn.addEventListener("click", () => {
      const user = getCurrentUser();

      if (!user) {
        alert("글쓰기는 로그인 후 이용 가능합니다.");
        window.location.href = "login.html";
        return;
      }
      if (writeSection) {
        writeSection.style.display = "block";
        if (titleInput) titleInput.focus();
      }
    });
  }

  // 글쓰기 취소 버튼
  if (cancelWriteBtn && writeSection && writeForm) {
    cancelWriteBtn.addEventListener("click", () => {
      writeForm.reset();
      writeSection.style.display = "none";
    });
  }

  // 글 등록 처리
  if (writeForm) {
    writeForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const user = getCurrentUser();
      if (!user) {
        alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
        window.location.href = "login.html";
        return;
      }

      const title = titleInput.value.trim();
      const content = contentInput.value.trim();
      const mediaUrlRaw = mediaUrlInput.value.trim();

      if (!title || !content) {
        alert("제목과 내용을 모두 입력하세요.");
        return;
      }

      let mediaUrl = mediaUrlRaw || null;
      let mediaType = null;

      if (mediaUrl) {
        const lower = mediaUrl.toLowerCase();
        if (
          lower.endsWith(".mp4") ||
          lower.endsWith(".webm") ||
          lower.endsWith(".ogg") ||
          lower.includes("youtube.com") ||
          lower.includes("youtu.be")
        ) {
          mediaType = "video";
        } else if (
          lower.endsWith(".jpg") ||
          lower.endsWith(".jpeg") ||
          lower.endsWith(".png") ||
          lower.endsWith(".gif") ||
          lower.endsWith(".webp") ||
          lower.endsWith(".avif")
        ) {
          mediaType = "image";
        } else {
          mediaType = "image";
        }
      }

      try {
        const res = await fetch("http://localhost:3000/community/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
            authorId: user.id,
            authorNickname: user.nickname,
            mediaUrl,
            mediaType,
          }),
        });

        const data = await res.json();
        console.log("POST /community/post:", data);

        if (!data.success) {
          alert(data.message || "게시글 등록에 실패했습니다.");
          return;
        }

        alert("게시글이 등록되었습니다.");
        writeForm.reset();
        if (writeSection) writeSection.style.display = "none";
        await loadPosts();
      } catch (err) {
        console.error(err);
        alert("서버 오류가 발생했습니다.");
      }
    });
  }

  // 페이지 로드시 글 목록 로드
  loadPosts();

  async function loadPosts() {
    if (!feed) return;

    feed.innerHTML = "<p>게시글을 불러오는 중입니다...</p>";

    try {
      const res = await fetch("http://localhost:3000/community/posts");
      const data = await res.json();
      console.log("GET /community/posts:", data);

      if (!data.success || !Array.isArray(data.posts) || data.posts.length === 0) {
        feed.innerHTML = "<p>작성된 게시글이 없습니다.</p>";
        return;
      }

      feed.innerHTML = "";

      data.posts.forEach((post) => {
        const card = document.createElement("article");
        card.className = "post-card";

        const created = new Date(post.createdAt);
        const createdStr = isNaN(created.getTime())
          ? ""
          : created.toLocaleString();

        const safeTitle = escapeHtml(post.title);
        const safeContent = escapeHtml(post.content).replace(/\n/g, "<br>");
        const safeNickname = escapeHtml(post.authorNickname);

        let mediaHtml = "";
        if (post.mediaUrl) {
          if (post.mediaType === "video") {
            if (
              post.mediaUrl.includes("youtube.com") ||
              post.mediaUrl.includes("youtu.be")
            ) {
              const embedUrl = makeYoutubeEmbedUrl(post.mediaUrl);
              mediaHtml = `
                <div class="post-media">
                  <iframe
                    src="${embedUrl}"
                    frameborder="0"
                    allowfullscreen
                  ></iframe>
                </div>
              `;
            } else {
              mediaHtml = `
                <div class="post-media">
                  <video controls src="${post.mediaUrl}"></video>
                </div>
              `;
            }
          } else {
            mediaHtml = `
              <div class="post-media">
                <img src="${post.mediaUrl}" alt="첨부 이미지">
              </div>
            `;
          }
        }

        card.innerHTML = `
          <h3 class="post-title">${safeTitle}</h3>
          <p class="post-content">${safeContent}</p>
          ${mediaHtml}
          <div class="post-meta">
            <span class="post-author">${safeNickname}</span>
            <span class="post-date">${createdStr}</span>
          </div>
        `;

        feed.appendChild(card);
      });
    } catch (err) {
      console.error(err);
      feed.innerHTML = "<p>게시글을 불러오는 중 오류가 발생했습니다.</p>";
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function makeYoutubeEmbedUrl(url) {
    try {
      if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1].split(/[?&]/)[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      const u = new URL(url);
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      return url;
    } catch {
      return url;
    }
  }
});
