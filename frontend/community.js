// community.js

// 여기서는 API_BASE, getCurrentUser 를 "auth.js에서 전역으로" 가져다 씀
// 새로 선언하지 않는다!

document.addEventListener("DOMContentLoaded", () => {
  const writeSection = document.getElementById("writeSection");
  const writeToggleBtn = document.getElementById("writePostBtn");
  const writeCancelBtn = document.getElementById("cancelWriteBtn");
  const writeForm = document.getElementById("writeForm");
  const feedEl = document.getElementById("communityFeed");

  // ▶ 새 글 쓰기 버튼 토글
  if (writeToggleBtn) {
    writeToggleBtn.addEventListener("click", () => {
      const user = getCurrentUser();
      if (!user) {
        alert("로그인 후 글을 작성할 수 있습니다.");
        window.location.href = "login.html";
        return;
      }

      if (!writeSection) return;

      writeSection.style.display =
        writeSection.style.display === "none" || !writeSection.style.display
          ? "block"
          : "none";
    });
  }

  // ▶ 글쓰기 취소 버튼
  if (writeCancelBtn) {
    writeCancelBtn.addEventListener("click", () => {
      if (writeSection) writeSection.style.display = "none";
      if (writeForm) writeForm.reset();
    });
  }

  // ▶ 글 등록
  if (writeForm) {
    writeForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const currentUser = getCurrentUser();
      if (!currentUser) {
        alert("로그인 후 글을 작성할 수 있습니다.");
        window.location.href = "login.html";
        return;
      }

      const title = document.getElementById("postTitle").value.trim();
      const content = document.getElementById("postContent").value.trim();
      const mediaUrl = document.getElementById("postMediaUrl").value.trim();

      if (!title || !content) {
        alert("제목과 내용을 입력해 주세요.");
        return;
      }

      try {
        const res = await fetch(`${window.API_BASE}/community/post`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
            authorId: currentUser.id,
            authorNickname: currentUser.nickname,
            mediaUrl: mediaUrl || null,
            mediaType: null,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          console.error("글 등록 실패:", res.status, data);
          alert(data.message || "글 등록에 실패했습니다.");
          return;
        }

        // 새 글을 맨 위에 추가
        prependPost(data.post);

        writeForm.reset();
        if (writeSection) writeSection.style.display = "none";
      } catch (err) {
        console.error("글 등록 중 통신 오류:", err);
        alert("서버와 통신 중 오류가 발생했습니다.");
      }
    });
  }

  // ▶ 댓글 등록 (이벤트 위임)
  if (feedEl) {
    feedEl.addEventListener("submit", async (e) => {
      if (!e.target.matches(".comment-form")) return;
      e.preventDefault();

      const currentUser = getCurrentUser();
      if (!currentUser) {
        alert("로그인 후 댓글을 작성할 수 있습니다.");
        window.location.href = "login.html";
        return;
      }

      const form = e.target;
      const postId = form.dataset.postId;
      const input = form.querySelector("input[type='text']");
      const content = input.value.trim();
      if (!content) return;

      try {
        const res = await fetch(
          `${window.API_BASE}/community/${postId}/comment`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              authorId: currentUser.id,
              authorNickname: currentUser.nickname,
              content,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          console.error("댓글 등록 실패:", res.status, data);
          alert("댓글 등록 실패");
          return;
        }

        const list = document.querySelector(
          `.comment-list[data-post-id="${postId}"]`
        );
        if (!list) return;

        const emptySpan = list.querySelector(".comment-empty");
        if (emptySpan) emptySpan.remove();

        const div = document.createElement("div");
        div.className = "comment-item";
        div.innerHTML = `<strong>${escapeHtml(
          data.comment.authorNickname
        )}</strong>${escapeHtml(data.comment.content)}`;
        list.appendChild(div);

        input.value = "";
      } catch (err) {
        console.error("댓글 등록 중 통신 오류:", err);
        alert("서버와 통신 중 오류가 발생했습니다.");
      }
    });
  }

  // ▶ 초기 글 목록 로드
  loadPosts();
});

// ----------------------
// 게시글 목록 불러오기
// ----------------------
async function loadPosts() {
  try {
    const res = await fetch(`${window.API_BASE}/community/posts`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      console.error("게시글 로드 실패:", res.status, data);
      return;
    }

    const feed = document.querySelector(".community-feed");
    if (!feed) return;

    feed.innerHTML = "";

    data.posts.forEach((post) => {
      appendPost(post);
      loadComments(post._id);
    });
  } catch (err) {
    console.error("게시글 로드 중 오류:", err);
  }
}

function appendPost(post) {
  const feed = document.querySelector(".community-feed");
  if (!feed) return;
  const card = createPostCard(post);
  feed.appendChild(card);
}

function prependPost(post) {
  const feed = document.querySelector(".community-feed");
  if (!feed) return;
  const card = createPostCard(post);
  feed.prepend(card);
  loadComments(post._id);
}

// ----------------------
// 게시글 카드 생성
// ----------------------
function createPostCard(post) {
  const user = getCurrentUser();
  const wrapper = document.createElement("article");
  wrapper.className = "post-card";
  wrapper.dataset.post = post._id;

  const created = new Date(post.createdAt || Date.now());
  const dateText = created.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  let mediaHtml = "";
  if (post.mediaUrl) {
    if (/youtube\.com|youtu\.be/.test(post.mediaUrl)) {
      const embedUrl = getYoutubeEmbedUrl(post.mediaUrl);
      if (embedUrl) {
        mediaHtml = `
          <div class="post-video-wrapper">
            <iframe
              src="${embedUrl}"
              title="YouTube video"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        `;
      } else {
        mediaHtml = `<a href="${post.mediaUrl}" target="_blank" rel="noopener noreferrer">영상 보기</a>`;
      }
    } else {
      mediaHtml = `<img src="${post.mediaUrl}" alt="이미지">`;
    }
  }

  const deleteButtonHtml =
    user && user.id == post.authorId
      ? `<button class="delete-btn" onclick="deletePost('${post._id}')">삭제</button>`
      : "";

  wrapper.innerHTML = `
    ${deleteButtonHtml}
    <h3 class="post-header">${escapeHtml(post.title)}</h3>
    <div class="post-content">
      <p>${escapeHtml(post.content)}</p>
      ${mediaHtml || ""}
    </div>

    <div class="post-meta">
      <span>${escapeHtml(post.authorNickname)}</span>
      <span>${dateText}</span>
    </div>

    <div class="comment-section">
      <div class="comment-list" data-post-id="${post._id}">
        <span class="comment-empty">아직 댓글이 없습니다.</span>
      </div>

      ${
        user
          ? `
        <form class="comment-form" data-post-id="${post._id}">
          <input type="text" placeholder="댓글을 입력하세요" />
          <button type="submit">등록</button>
        </form>
      `
          : `
        <div class="comment-login-hint">
          댓글을 작성하려면 로그인하세요.
        </div>
      `
      }
    </div>
  `;

  return wrapper;
}

// ----------------------
// 댓글 목록 불러오기
// ----------------------
async function loadComments(postId) {
  try {
    const res = await fetch(`${window.API_BASE}/community/${postId}/comments`);
    const data = await res.json();

    if (!res.ok || !data.success) return;

    const list = document.querySelector(
      `.comment-list[data-post-id="${postId}"]`
    );
    if (!list) return;

    list.innerHTML = "";

    if (data.comments.length === 0) {
      list.innerHTML = `<span class="comment-empty">아직 댓글이 없습니다.</span>`;
      return;
    }

    data.comments.forEach((c) => {
      const div = document.createElement("div");
      div.className = "comment-item";
      div.innerHTML = `<strong>${escapeHtml(
        c.authorNickname
      )}</strong>${escapeHtml(c.content)}`;
      list.appendChild(div);
    });
  } catch (err) {
    console.error("댓글 목록 로드 중 오류:", err);
  }
}

// ----------------------
// 게시글 삭제
// ----------------------
async function deletePost(postId) {
  if (!confirm("삭제하시겠습니까?")) return;

  try {
    const res = await fetch(`${window.API_BASE}/community/post/${postId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    console.log("삭제 결과:", data);

    if (data.success) {
      alert("삭제 완료!");
      document.querySelector(`[data-post="${postId}"]`)?.remove();
    } else {
      alert(data.message || "삭제 실패");
    }
  } catch (err) {
    console.error("게시글 삭제 중 통신 오류:", err);
    alert("서버와 통신 중 오류가 발생했습니다.");
  }
}

// ----------------------
// 유틸 함수들
// ----------------------
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getYoutubeEmbedUrl(raw) {
  try {
    const url = new URL(raw);

    if (url.hostname.includes("youtube.com") && url.pathname.startsWith("/embed/")) {
      return raw;
    }

    let videoId = "";

    if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.slice(1);
    }

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") || "";
      } else if (url.pathname.startsWith("/shorts/")) {
        const parts = url.pathname.split("/");
        videoId = parts[2] || "";
      }
    }

    if (!videoId) return null;

    return `https://www.youtube.com/embed/${videoId}`;
  } catch (e) {
    console.error("유튜브 URL 파싱 실패:", raw, e);
    return null;
  }
}
