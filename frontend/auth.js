// auth.js
console.log("auth.js loaded");

// 🔥 공통 API 주소 (전역으로 한 번만 선언)
window.API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "http://202.31.146.36:3000"; // 필요하면 공인 IP로 수정

// 현재 로그인 유저 읽기
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
    // 헤더가 없는 페이지는 무시
    return;
  }

  // 로그인 안 된 상태
  if (!user) {
    iconBtn.style.display = "inline-flex";
    userInfo.style.display = "none";
  } else {
    // 로그인 된 상태
    iconBtn.style.display = "none";
    userInfo.style.display = "flex";

    if (nicknameSpan) {
      nicknameSpan.textContent = user.nickname || user.username || "User";
    }

    // 관리자 계정 표시 (원하면 조건 변경 가능)
    if (adminLink) {
      if (user.username === "admin") {
        adminLink.style.display = "block";
      } else {
        adminLink.style.display = "none";
      }
    }
  }

  // 로그아웃 버튼
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("fcb_user");
      alert("로그아웃 되었습니다.");
      window.location.href = "index.html";
    });
  }
});
