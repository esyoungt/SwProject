// auth.js
console.log("auth.js loaded");

function getCurrentUser() {
  try {
    const raw = localStorage.getItem("fcb_user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const user = getCurrentUser();

  const iconBtn = document.querySelector(".top-bar-right .icon-btn");
  const userInfo = document.querySelector(".top-bar-right .user-info");
  const nicknameSpan = document.querySelector(".top-bar-right .nickname");
  const adminLink = document.querySelector(".top-bar-right .admin-link");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!iconBtn || !userInfo) {
    // 헤더 구조가 없는 페이지면 조용히 패스
    return;
  }

  // 로그인 안 된 상태
  if (!user) {
    iconBtn.style.display = "inline-flex";
    userInfo.style.display = "none";
    return;
  }

  // 로그인 된 상태
  iconBtn.style.display = "none";
  userInfo.style.display = "flex";
  if (nicknameSpan) {
    nicknameSpan.textContent = user.nickname || user.username || "User";
  }

  // 관리자 계정 처리 예시 (원하면 조건 바꿔도 됨)
  if (adminLink) {
    if (user.username === "admin") {
      adminLink.style.display = "block";
    } else {
      adminLink.style.display = "none";
    }
  }

  // 로그아웃
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("fcb_user");
      alert("로그아웃 되었습니다.");
      window.location.href = "index.html";
    });
  }
});
